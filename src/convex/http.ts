import { registerRoutes } from "@convex-dev/stripe"
import { httpRouter } from "convex/server"
import { components, internal } from "./_generated/api"
import { Id } from "./_generated/dataModel"
import { auth } from "./auth"

const http = httpRouter()

auth.addHttpRoutes(http)

// Register Stripe webhook handler at /stripe/webhook
registerRoutes(http, components.stripe, {
    webhookPath: "/stripe/webhook",
    events: {
        "payment_intent.succeeded": async (ctx, event) => {
            const paymentIntent = event.data.object
            const roomId = paymentIntent.metadata.roomId as Id<"rooms">

            // Convert the pending pro room to an active pro room
            await ctx.runMutation(internal.rooms.manage.activateProRoom, {
                roomId,
            })
        },
    },
})

export default http
