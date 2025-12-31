import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { query, MutationCtx } from "./_generated/server"
import { mutation } from "./functions"
import { attachNicknames, getNextSong, getQueueFCFS, getQueueRoundRobin, getQueueWeighted } from "./scheduling"
import { internal } from "./_generated/api";


/**
 * This query returns the queue of songs for a room.
 *
 * It does not include the current song. That is stored in the room object.
 */
export const getQueue = query({
    args: { 
        roomId: v.id("rooms"),
        cursor: v.optional(v.string()),
        numItems: v.optional(v.number()),
    },
    handler: async (ctx, { roomId, numItems }) => {
        const room = await ctx.db.get(roomId)
        if (!room) return []

        const scheduler = room.settings?.scheduler ?? "roundRobin"
        numItems = numItems ?? 5

        switch (scheduler) {
        case "FCFS":
            return getQueueFCFS(ctx, roomId, numItems)
        case "roundRobin":
            return getQueueRoundRobin(ctx, roomId, numItems)
        case "weighted":
            return getQueueWeighted(ctx, roomId, numItems)
        default:
            return getQueueFCFS(ctx, roomId, numItems)
        }
    },
})

export const getPersonalQueue = query({
    args: {
        roomId: v.id("rooms"),
        cursor: v.optional(v.string()),
        numItems: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (userId === null)
            return []
        const queue = await ctx.db
            .query("queuedSongs")
            .withIndex("by_added_by_room", q => q.eq("addedBy", userId).eq("room", args.roomId))
            .order("asc")
            .take(args.numItems ?? 5)
        return await attachNicknames(ctx, queue)
    }
})

export const getRoomByCode = query({
    args: {
        code: v.string(),
    },
    handler: async (ctx, args) => {
        const room = await ctx.db
            .query("rooms")
            .withIndex("by_code", (q) => q.eq("code", args.code))
            .unique()

        if (!room) {
            return null
        }

        const currentSongUser = room?.currentSong?.addedBy
            ? await ctx.db.get(room.currentSong.addedBy as Id<"users">)
            : null

        // Enrich the query result with the nickname of the user who added the current song
        return {
            ...room,
            currentSong: room.currentSong
                ? {
                      ...room.currentSong,
                      addedByNickname: currentSongUser?.nickname,
                  }
                : null,
        }
    },
})

export const isHost = query({
    args: {
        roomId: v.id("rooms"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            return false
        }

        const room = await ctx.db.get(args.roomId)
        if (!room) {
            throw new Error("Room not found")
        }

        return room.host === (userId as Id<"users">)
    },
})

export const getSongsLeftToAdd = query({
    args: {
        roomId: v.id("rooms"),
    },
    handler: async (ctx, args) => {
        const room = await ctx.db.get(args.roomId)
        if (!room) {
            throw new Error("Room not found")
        }

        const userId = await getAuthUserId(ctx)
        if (!userId) {
            return null
        }

        const userSongs = await ctx.db
            .query("queuedSongs")
            .withIndex("by_added_by_room", (q) =>
                q.eq("addedBy", userId as Id<"users">).eq("room", args.roomId),
            )
            .collect()

        return room.settings.maxSongsPerUser - userSongs.length
    },
})

export const addSong = mutation({
    args: {
        roomId: v.id("rooms"),
        videoId: v.string(),
        title: v.string(),
        artist: v.string(),
        duration: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
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

        // Decide whether this song should become the current song or to queue it
        if (!room.currentSong) {
            // room currently has no song playing, so this song should become the current song
            await ctx.db.patch(args.roomId, {
                currentSong: {
                    addedBy: userId as Id<"users">,
                    videoId: args.videoId,
                    title: args.title,
                    artist: args.artist,
                    duration: args.duration,
                    type: "addedByUser",
                },
            })
        } else {
            // room currently has a song playing, so this song should be queued
            await ctx.db.insert("queuedSongs", {
                room: args.roomId,
                videoId: args.videoId,
                type: "addedByUser",
                addedBy: userId as Id<"users">,
                title: args.title,
                artist: args.artist,
                duration: args.duration,
            })
        }
    },
})

/**
 * This mutation pops the current song from the queue and makes the next song the current song.
 *
 * It should be called by the host when the current song finished playing.
 */
export const popSong = mutation({
    args: {
        roomId: v.id("rooms"),
    },
    handler: async (ctx: MutationCtx, args) => {
        const room = await ctx.db.get(args.roomId)
        if (!room) {
            throw new Error("Room not found")
        }

        // Check if the user is the host of the room
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("User not found")
        }
        if (room.host !== (userId as Id<"users">)) {
            throw new Error("User is not the host of the room")
        }

        const oldSong = room.currentSong

        // Add current song to history
        if (oldSong) {
            await ctx.db.insert("history", {
                room: args.roomId,
                ...oldSong,
            })
        }

        // Check if there is a song in the queue
        const nextSong = await getNextSong(ctx, args.roomId)

        // If there is no next song, just remove the current song
        // But if there is a next song, make it the current song and remove that song from the queue
        if (nextSong) {
            // Extract only the song fields, excluding Convex metadata and room field
            const { addedBy, type, videoId, title, artist, duration } = nextSong
            await ctx.db.patch(args.roomId, {
                currentSong: {
                    addedBy,
                    type,
                    videoId,
                    title,
                    artist,
                    duration,
                },
            })
            // remove song from queue
            await ctx.db.delete(nextSong._id)
        } else {
            await ctx.db.patch(args.roomId, {
                currentSong: undefined,
            })
        }
        console.log(`About to add song to playlist ${room.playlistId}`)
        // @ts-ignore
        await ctx.scheduler.runAfter(0, internal.functions.addSongToPlaylist, {
            roomId: args.roomId,
            videoId: oldSong?.videoId,
            playlistId: room.playlistId
        })
    },
})

export const getSongHistory = query(
    async ({ db }, { roomId }: { roomId: Id<"rooms"> }) => {
        const history = await db
            .query("history")
            .withIndex("by_room", (q) =>
                q.eq("room", roomId),
            )
            .order("desc")
            .collect()

        return await Promise.all(
            history.map(async (song) => {
                if (!song.addedBy) {
                    return {
                        ...song,
                        addedByNickname: undefined,
                    }
                }
                const user = await db.get(song.addedBy as Id<"users">)
                return {
                    ...song,
                    addedByNickname: user?.nickname,
                }
            }),
        )
    },
)

export const setRoomPlaylist = mutation({
  args: {
    roomId: v.id("rooms"),
    playlistId: v.string(),
  },
  handler: async ({ db }, { roomId, playlistId }) => {
    await db.patch(roomId, { playlistId })
  },
})

export const getRoomById = query({
    args: { roomId: v.id("rooms") },
    handler: async ({ db }, { roomId }) => {
        const room = await db.get(roomId)
        return room
    },
})

