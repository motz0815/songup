import Google from "@auth/core/providers/google"
import { Anonymous } from "@convex-dev/auth/providers/Anonymous"
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server"
import { internal } from "./_generated/api"
import { MutationCtx, query } from "./_generated/server"

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Anonymous, Google],
    jwt: {
        customClaims: async (ctx, { userId }) => {
            const user = await ctx.db.get("users", userId)
            return { userId, email: user?.email, name: user?.name }
        },
    },
    callbacks: {
        // Trigger the user signed up event after the user is created
        async afterUserCreatedOrUpdated(
            ctx: MutationCtx,
            { userId, profile, provider },
        ) {
            if (
                !provider ||
                provider.type !== "oauth" ||
                provider.name !== "Google"
            )
                return

            await ctx.scheduler.runAfter(
                0,
                internal.analytics.users.userSignedUp,
                {
                    userId,
                    email: profile?.email,
                    name: profile?.name as string | undefined,
                },
            )
        },
    },
})

export const getCurrentUser = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null
        return await ctx.db.get("users", userId)
    },
})
