import { StripeSubscriptions } from "@convex-dev/stripe"
import { v } from "convex/values"
import { components } from "./_generated/api"
import { action, query } from "./_generated/server"

// Most of the following functions are more or less copied over from the convex-stripe example at https://github.com/get-convex/stripe/blob/master/example/convex/stripe.ts

const stripeClient = new StripeSubscriptions(components.stripe, {})

function getURL(path: string = ""): string {
    // Check if SITE_URL is set and non-empty. Set this to your site URL in production env.
    let url =
        process?.env?.SITE_URL && process.env.SITE_URL.trim() !== ""
            ? process.env.SITE_URL
            : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
              process?.env?.NEXT_PUBLIC_VERCEL_URL &&
                process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ""
              ? process.env.NEXT_PUBLIC_VERCEL_URL
              : // If neither is set, default to localhost for local development.
                "http://localhost:3000/"

    // Trim the URL and remove trailing slash if exists.
    url = url.replace(/\/+$/, "")
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`
    // Ensure path starts without a slash to avoid double slashes in the final URL.
    path = path.replace(/^\/+/, "")

    // Concatenate the URL and the path.
    return path ? `${url}/${path}` : url
}

// ============================================================================
// CUSTOMER MANAGEMENT (Customer Creation)
// ============================================================================

/**
 * Create or get a Stripe customer for the current user.
 * This ensures every user has a linked Stripe customer.
 */
export const getOrCreateCustomer = action({
    args: {},
    returns: v.object({
        customerId: v.string(),
        isNew: v.boolean(),
    }),
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        return await stripeClient.getOrCreateCustomer(ctx, {
            userId: identity.subject,
            email: identity.email,
            name: identity.name,
        })
    },
})

// ============================================================================
// CHECKOUT SESSIONS
// ============================================================================

/**
 * Create a checkout session for a subscription.
 * Automatically creates/links a customer first.
 */
export const createSubscriptionCheckout = action({
    args: {
        priceId: v.string(),
        quantity: v.optional(v.number()),
    },
    returns: v.object({
        sessionId: v.string(),
        url: v.union(v.string(), v.null()),
    }),
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        // Get or create customer using the component
        const customerResult = await stripeClient.getOrCreateCustomer(ctx, {
            userId: identity.subject,
            email: identity.email,
            name: identity.name,
        })

        // Create checkout session with subscription metadata for linking
        return await stripeClient.createCheckoutSession(ctx, {
            priceId: args.priceId,
            customerId: customerResult.customerId,
            mode: "subscription",
            quantity: args.quantity,
            successUrl: getURL("/host/?success=true"),
            cancelUrl: getURL("/host/?canceled=true"),
            metadata: {
                userId: identity.subject,
                productType: "hat_subscription",
            },
            subscriptionMetadata: {
                userId: identity.subject,
            },
        })
    },
})

/**
 * Create a checkout session for a one-time payment.
 */
export const createPaymentCheckout = action({
    args: {
        priceId: v.string(),
    },
    returns: v.object({
        sessionId: v.string(),
        url: v.union(v.string(), v.null()),
    }),
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        // Get or create customer using the component
        const customerResult = await stripeClient.getOrCreateCustomer(ctx, {
            userId: identity.subject,
            email: identity.email,
            name: identity.name,
        })

        // Create checkout session with payment intent metadata for linking
        return await stripeClient.createCheckoutSession(ctx, {
            priceId: args.priceId,
            customerId: customerResult.customerId,
            mode: "payment",
            successUrl: getURL("/host/?success=true"),
            cancelUrl: getURL("/host/?canceled=true"),
            metadata: {
                userId: identity.subject,
                productType: "hat",
            },
            paymentIntentMetadata: {
                userId: identity.subject,
            },
        })
    },
})

// ============================================================================
// SUBSCRIPTION QUERIES
// ============================================================================

/**
 * Get subscription information by subscription ID.
 */
export const getSubscriptionInfo = query({
    args: {
        subscriptionId: v.string(),
    },
    returns: v.union(
        v.object({
            stripeSubscriptionId: v.string(),
            stripeCustomerId: v.string(),
            status: v.string(),
            priceId: v.string(),
            quantity: v.optional(v.number()),
            currentPeriodEnd: v.number(),
            cancelAtPeriodEnd: v.boolean(),
            metadata: v.optional(v.any()),
            userId: v.optional(v.string()),
            orgId: v.optional(v.string()),
        }),
        v.null(),
    ),
    handler: async (ctx, args) => {
        return await ctx.runQuery(components.stripe.public.getSubscription, {
            stripeSubscriptionId: args.subscriptionId,
        })
    },
})

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

/**
 * Cancel a subscription either immediately or at period end.
 */
export const cancelSubscription = action({
    args: {
        subscriptionId: v.string(),
        immediately: v.optional(v.boolean()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        // Verify ownership by checking the subscription's userId
        const subscription = await ctx.runQuery(
            components.stripe.public.getSubscription,
            { stripeSubscriptionId: args.subscriptionId },
        )

        if (!subscription || subscription.userId !== identity.subject) {
            throw new Error("Subscription not found or access denied")
        }

        await stripeClient.cancelSubscription(ctx, {
            stripeSubscriptionId: args.subscriptionId,
            cancelAtPeriodEnd: !args.immediately,
        })

        return null
    },
})

/**
 * Reactivate a subscription that was set to cancel at period end.
 */
export const reactivateSubscription = action({
    args: {
        subscriptionId: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        // Verify ownership
        const subscription = await ctx.runQuery(
            components.stripe.public.getSubscription,
            { stripeSubscriptionId: args.subscriptionId },
        )

        if (!subscription || subscription.userId !== identity.subject) {
            throw new Error("Subscription not found or access denied")
        }

        if (!subscription.cancelAtPeriodEnd) {
            throw new Error("Subscription is not set to cancel")
        }

        // Reactivate by setting cancel_at_period_end to false
        await stripeClient.reactivateSubscription(ctx, {
            stripeSubscriptionId: args.subscriptionId,
        })

        return null
    },
})

// ============================================================================
// CUSTOMER PORTAL (#6 - Manage Billing)
// ============================================================================

/**
 * Generate a link to the Stripe Customer Portal where users can
 * manage their subscriptions, update payment methods, retry failed payments, etc.
 */
export const getCustomerPortalUrl = action({
    args: {},
    returns: v.union(
        v.object({
            url: v.string(),
        }),
        v.null(),
    ),
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        // Find customer ID from subscriptions or payments
        const subscriptions = await ctx.runQuery(
            components.stripe.public.listSubscriptionsByUserId,
            { userId: identity.subject },
        )

        if (subscriptions.length > 0) {
            return await stripeClient.createCustomerPortalSession(ctx, {
                customerId: subscriptions[0].stripeCustomerId,
                returnUrl: getURL("/host"),
            })
        }

        const payments = await ctx.runQuery(
            components.stripe.public.listPaymentsByUserId,
            { userId: identity.subject },
        )

        if (payments.length > 0 && payments[0].stripeCustomerId) {
            return await stripeClient.createCustomerPortalSession(ctx, {
                customerId: payments[0].stripeCustomerId,
                returnUrl: getURL("/host"),
            })
        }

        // No customer found
        return null
    },
})

// ============================================================================
// CUSTOMER DATA
// ============================================================================

/**
 * Get customer data including subscriptions and invoices.
 */
export const getCustomerData = query({
    args: {
        customerId: v.string(),
    },
    returns: v.object({
        customer: v.union(
            v.object({
                stripeCustomerId: v.string(),
                email: v.optional(v.string()),
                name: v.optional(v.string()),
                metadata: v.optional(v.any()),
            }),
            v.null(),
        ),
        subscriptions: v.array(
            v.object({
                stripeSubscriptionId: v.string(),
                stripeCustomerId: v.string(),
                status: v.string(),
                priceId: v.string(),
                quantity: v.optional(v.number()),
                currentPeriodEnd: v.number(),
                cancelAtPeriodEnd: v.boolean(),
                metadata: v.optional(v.any()),
                userId: v.optional(v.string()),
                orgId: v.optional(v.string()),
            }),
        ),
        invoices: v.array(
            v.object({
                stripeInvoiceId: v.string(),
                stripeCustomerId: v.string(),
                stripeSubscriptionId: v.optional(v.string()),
                status: v.string(),
                amountDue: v.number(),
                amountPaid: v.number(),
                created: v.number(),
            }),
        ),
    }),
    handler: async (ctx, args) => {
        const customer = await ctx.runQuery(
            components.stripe.public.getCustomer,
            {
                stripeCustomerId: args.customerId,
            },
        )
        const subscriptions = await ctx.runQuery(
            components.stripe.public.listSubscriptions,
            { stripeCustomerId: args.customerId },
        )
        const invoices = await ctx.runQuery(
            components.stripe.public.listInvoices,
            {
                stripeCustomerId: args.customerId,
            },
        )

        return {
            customer,
            subscriptions,
            invoices,
        }
    },
})
