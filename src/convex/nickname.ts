import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { query } from "./_generated/server"
import { betterAuthComponent, ensureAuthOrAnonymous } from "./auth"
import { mutation } from "./functions"

export const setNickname = mutation({
    args: {
        nickname: v.string(),
    },
    handler: async (ctx, args) => {
        await ensureAuthOrAnonymous(ctx)

        const userId = await betterAuthComponent.getAuthUserId(ctx)

        // Update the user's nickname
        await ctx.db.patch(userId as Id<"users">, {
            nickname: args.nickname,
        })
    },
})

export const getNickname = query({
    handler: async (ctx) => {
        const userId = await betterAuthComponent.getAuthUserId(ctx)
        if (!userId) return null
        const user = await ctx.db.get(userId as Id<"users">)
        return user?.nickname
    },
})
