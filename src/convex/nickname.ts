import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { query } from "./_generated/server"
import { mutation } from "./functions"

export const setNickname = mutation({
    args: {
        nickname: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("User not found")
        }

        // Update the user's nickname
        await ctx.db.patch(userId as Id<"users">, {
            nickname: args.nickname,
        })
    },
})

export const getNickname = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null
        const user = await ctx.db.get(userId as Id<"users">)
        return user?.nickname
    },
})
