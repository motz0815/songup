import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { Id } from "../_generated/dataModel"
import { MutationCtx, query } from "../_generated/server"
import { internalMutation, mutation } from "../functions"

export const createRoom = mutation({
    args: {
        maxSongsPerUser: v.number(),
        fallbackSongs: v.optional(
            v.array(
                v.object({
                    videoId: v.string(),
                    title: v.string(),
                    artist: v.string(),
                    duration: v.number(),
                }),
            ),
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("User not found")
        }

        let code: string
        // Generate a unique room code
        do {
            code = generateRoomCode(4)
        } while (
            await ctx.db
                .query("rooms")
                .withIndex("by_code", (q) => q.eq("code", code))
                .unique()
        )

        const roomId = await ctx.db.insert("rooms", {
            host: userId as Id<"users">,
            code,
            expiresAt: Date.now() + 1000 * 60 * 60 * 48, // 48 hours
            settings: {
                maxSongsPerUser: args.maxSongsPerUser,
            },
        })

        if (args.fallbackSongs) {
            await addFallbackSongs(ctx, roomId, args.fallbackSongs)
        }
        return { roomId, code }
    },
})

export const listOwnRooms = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            return null
        }

        return await ctx.db
            .query("rooms")
            .withIndex("by_host", (q) => q.eq("host", userId as Id<"users">))
            .collect()
    },
})

async function addFallbackSongs(
    ctx: MutationCtx,
    roomId: Id<"rooms">,
    songs: {
        videoId: string
        title: string
        artist: string
        duration: number
    }[],
) {
    // Deliberately don't add the fallback songs directly into the current song in the room object
    // to make users add songs themselves and see that they get added in front of fallback songs
    // Limit to 100 songs
    for (const song of songs.slice(0, 100)) {
        await ctx.db.insert("queuedSongs", {
            room: roomId,
            type: "fallback",
            videoId: song.videoId,
            title: song.title,
            artist: song.artist,
            duration: song.duration,
        })
    }
}

export const cleanExpiredRooms = internalMutation({
    handler: async (ctx) => {
        const expiredRooms = await ctx.db
            .query("rooms")
            .withIndex("by_expires_at", (q) => q.lt("expiresAt", Date.now()))
            .collect()

        for (const room of expiredRooms) {
            await ctx.db.delete(room._id)
        }
    },
})

function generateRoomCode(length: number) {
    let result = ""
    const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789" // Uppercase characters and numbers (minus O and 0 to avoid confusion)
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        )
    }
    return result
}
