import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { Id } from "../_generated/dataModel"
import { MutationCtx } from "../_generated/server"
import { mutation } from "../functions"

/**
 * This mutation skips to the next song in the queue.
 * If there is no next song, it just stops playing the current song.
 *
 * Only usable by pro rooms.
 * This is meant to be used by the host on their mobile device.
 */
export const skipToNextSong = mutation({
    args: {
        roomId: v.id("rooms"),
    },
    handler: async (ctx, args) => {
        await assertHostAndProRoom(ctx, args.roomId)
        // Remove the next song from the queue and insert it into the room
        const nextSong = await ctx.db
            .query("queuedSongs")
            .withIndex("by_room_order_type", (q) => q.eq("room", args.roomId))
            .order("asc")
            .first()
        if (!nextSong) {
            // Just remove the current song
            await ctx.db.patch("rooms", args.roomId, {
                currentSong: undefined,
            })
            return
        }
        await ctx.db.delete("queuedSongs", nextSong._id)
        await ctx.db.patch("rooms", args.roomId, {
            currentSong: nextSong,
        })
    },
})

export const playQueuedSongNext = mutation({
    args: {
        roomId: v.id("rooms"),
        songId: v.id("queuedSongs"),
    },
    handler: async (ctx, args) => {
        await assertHostAndProRoom(ctx, args.roomId)

        // Get the order of the current first song in the queue
        const firstSong = await ctx.db
            .query("queuedSongs")
            .withIndex("by_room_order_type", (q) => q.eq("room", args.roomId))
            .order("asc")
            .first()
        if (!firstSong) {
            throw new Error("No first song found")
        }
        const order = firstSong.order

        // Update the order of the song to be the next one
        await ctx.db.patch("queuedSongs", args.songId, {
            order: order - 1,
        })
    },
})

async function assertHostAndProRoom(ctx: MutationCtx, roomId: Id<"rooms">) {
    const room = await ctx.db.get("rooms", roomId)
    // Check if the user is the host of the room
    const userId = await getAuthUserId(ctx)
    if (!userId) {
        throw new Error("User not found")
    }
    if (room?.host !== (userId as Id<"users">)) {
        throw new Error("User is not the host of the room")
    }

    // Check that it's a pro room
    if (room?.proStatus !== "active") {
        throw new Error("Room is not a pro room")
    }

    return room
}
