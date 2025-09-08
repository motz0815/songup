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

        // Nicknames should be between 3 and 16 characters long
        if (args.nickname.length < 3 || args.nickname.length > 16) {
            throw new Error("Nickname must be between 3 and 16 characters long")
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

export const getNicknameByUserId = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId as Id<"users">)
        return user?.nickname
    },
})
