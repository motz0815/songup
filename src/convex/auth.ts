import { Anonymous } from "@convex-dev/auth/providers/Anonymous"
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server"
import { Id } from "./_generated/dataModel"
import { query } from "./_generated/server"

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Anonymous],
})

export const getCurrentUser = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null
        return await ctx.db.get(userId as Id<"users">)
    },
})
