import Google from "@auth/core/providers/google"
import { Anonymous } from "@convex-dev/auth/providers/Anonymous"
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server"
import { query } from "./_generated/server"

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Anonymous, Google],
    jwt: {
        customClaims: async (ctx, { userId }) => {
            const user = await ctx.db.get("users", userId)
            return { userId, email: user?.email, name: user.name }
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
