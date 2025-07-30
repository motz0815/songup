import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { query, QueryCtx } from "./_generated/server"
import { betterAuthComponent } from "./auth"
import { mutation } from "./functions"

export const getCurrentSong = query({
    args: {
        roomId: v.id("rooms"),
    },
    handler: async (ctx, args) => {
        return await getCurrentSongInRoom(ctx, args.roomId)
    },
})

/**
 * This query returns the queue of songs for a room.
 *
 * It also includes the current song, because that is always the first song in the queue.
 */
export const getQueue = query({
    args: {
        roomId: v.id("rooms"),
        cursor: v.optional(v.string()),
        numItems: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("queuedSongs")
            .withIndex("by_room_type", (q) => q.eq("room", args.roomId))
            .order("asc")
            .paginate({
                cursor: args.cursor ?? null,
                numItems: args.numItems ?? 5,
            })
    },
})

export const getRoomByCode = query({
    args: {
        code: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("rooms")
            .withIndex("by_code", (q) => q.eq("code", args.code))
            .unique()
    },
})

export const addSong = mutation({
    args: {
        roomId: v.id("rooms"),
        videoId: v.string(),
        title: v.string(),
        artist: v.string(),
        thumbnail: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await betterAuthComponent.getAuthUserId(ctx)
        if (!userId) {
            throw new Error("User not found")
        }

        const room = await ctx.db.get(args.roomId)
        if (!room) {
            throw new Error("Room not found")
        }

        // check that user has still songs left to add
        const userSongs = await ctx.db
            .query("queuedSongs")
            .withIndex("by_added_by_room", (q) =>
                q.eq("addedBy", userId as Id<"users">).eq("room", args.roomId),
            )
            .collect()

        if (userSongs.length >= room.settings.maxSongsPerUser) {
            throw new Error("User has reached the maximum number of songs")
        }

        // Add song to queue
        const song = await ctx.db.insert("queuedSongs", {
            room: args.roomId,
            videoId: args.videoId,
            type: "addedByUser",
            addedBy: userId as Id<"users">,
            title: args.title,
            artist: args.artist,
            thumbnail: args.thumbnail,
        })

        return song
    },
})

export const popSong = mutation({
    args: {
        roomId: v.id("rooms"),
    },
    handler: async (ctx, args) => {
        const room = await ctx.db.get(args.roomId)
        if (!room) {
            throw new Error("Room not found")
        }

        // Check if the user is the host of the room
        const userId = await betterAuthComponent.getAuthUserId(ctx)
        if (!userId) {
            throw new Error("User not found")
        }
        if (room.host !== (userId as Id<"users">)) {
            throw new Error("User is not the host of the room")
        }

        // Get the topmost song in the queue (the current song)
        const currentSong = await getCurrentSongInRoom(ctx, args.roomId)

        if (!currentSong) {
            throw new Error("No song to pop")
        }

        await ctx.db.delete(currentSong._id)
    },
})

export const createRoom = mutation({
    args: {
        maxSongsPerUser: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await betterAuthComponent.getAuthUserId(ctx)
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
                .first()
        )

        const room = await ctx.db.insert("rooms", {
            host: userId as Id<"users">,
            code,
            expiresAt: Date.now() + 1000 * 60 * 60 * 48, // 48 hours
            settings: {
                maxSongsPerUser: args.maxSongsPerUser,
            },
        })
        return room
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

async function getCurrentSongInRoom(ctx: QueryCtx, roomId: Id<"rooms">) {
    return await ctx.db
        .query("queuedSongs")
        .withIndex("by_room_type", (q) => q.eq("room", roomId))
        .order("asc")
        .first()
}
