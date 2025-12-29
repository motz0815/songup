import { query } from "./_generated/server"
import { v } from "convex/values"
import { Id, Doc } from "./_generated/dataModel"
import type { QueryCtx } from "./_generated/server"

// FCFS: first song in queuedSongs
async function fcfsNextSong(ctx: any, roomId: Id<"rooms">) {
    return ctx.db
        .query("queuedSongs")
        .withIndex("by_room_type", (q: any) => q.eq("room", roomId))
        .order("asc")
        .first()
}

// Round-robin: pick next user in a round-robin way
async function roundRobinNextSong(ctx: any, roomId: Id<"rooms">) {
    const songs: Doc<"queuedSongs">[] = await ctx.db
        .query("queuedSongs")
        .withIndex("by_room_type", (q: any) => q.eq("room", roomId))
        .order("asc")
        .collect()

    if (!songs.length) return null

    // Separate anon songs from regular user songs
    const anonQueue: Doc<"queuedSongs">[] = []
    const userQueues: Record<string, Doc<"queuedSongs">[]> = {}

    songs.forEach((song) => {
            const userId = song.addedBy?.toString() ?? "anon"
            if (song.type == "fallback") {
                anonQueue.push(song)
            } else {
                if (!userQueues[userId]) userQueues[userId] = []
                userQueues[userId].push(song)
            }
    })

    const room = await ctx.db.get(roomId)
    const userIds = Object.keys(userQueues).sort()

    // Determine the current user
    const curUserId = room.currentSong?.addedBy?.toString() || null

    // Find next user after current user in round-robin
    let idx = 0
    if (curUserId) {
        const curIndex = userIds.indexOf(curUserId)
        idx = curIndex >= 0 ? (curIndex + 1) % userIds.length : 0
    }

    // Search for next user with queued songs
    for (let i = 0; i < userIds.length; i++) {
        const tryIdx = (idx + i) % userIds.length
        const queue = userQueues[userIds[tryIdx]]
        if (queue.length > 0) {
            // Found next regular user song
            return queue[0]
        }
    }

    // If no regular users have songs, fallback to anon queue
    return anonQueue.length > 0 ? anonQueue[0] : null
}


// Weighted: pick based on user rating
async function weightedNextSong(ctx: any, roomId: Id<"rooms">) {
    const songs: Doc<"queuedSongs">[] = await ctx.db
        .query("queuedSongs")
        .withIndex("by_room_type", (q: any) => q.eq("room", roomId))
        .order("asc")
        .collect()

    if (!songs.length) return null

    // Separate anon songs from regular user songs
    const anonQueue: Doc<"queuedSongs">[] = []
    const userQueues: Record<string, Doc<"queuedSongs">[]> = {}

    songs.forEach((song) => {
        const userId = song.addedBy?.toString() ?? "anon"
        if (song.type == "fallback") {
            anonQueue.push(song)
        } else {
            if (!userQueues[userId]) userQueues[userId] = []
            userQueues[userId].push(song)
        }
    })

    // Get ids of all users who have queued songs
    const userIds = [...new Set(songs.map((s) => s.addedBy?.toString()).filter(Boolean))]

    // if no user queued songs, return fallback
    if (!userIds.length) return anonQueue.length > 0 ? anonQueue[0] : null

    // Get the ratings of all users with queued songs
    const userRatings: Record<string, number> = {}
    for (const id of userIds) {
        const user: Doc<"users"> = await ctx.db.get(id)
        if (user) userRatings[user._id.toString()] = user.ratingScore ?? 1
    }

    const totalWeight = Object.values(userRatings).reduce((acc, score) => acc + score, 0)
    let r = Math.random() * totalWeight
    for (const userId in userRatings) {
        if (r < userRatings[userId]) {
            return userQueues[userId][0]
        }
        r -= userRatings[userId]
    }

    // if all else fails
    return anonQueue.length > 0 ? anonQueue[0] : null
}

async function attachNicknames(ctx: any, songs: Doc<"queuedSongs">[]) {
    return Promise.all(
        songs.map(async (song) => {
        if (!song.addedBy) {
            return { ...song, addedByNickname: undefined }
        }
        const user = await ctx.db.get(song.addedBy as Id<"users">)
        return { ...song, addedByNickname: user?.nickname }
        })
    )
}

export async function fcfsQueue(ctx: QueryCtx, roomId: Id<"rooms">, numItems: number) {
    return await ctx.db
        .query("queuedSongs")
        .withIndex("by_room_type", q => q.eq("room", roomId))
        .order("asc")
        .take(numItems)
}

export async function roundRobinQueue(ctx: any, roomId: Id<"rooms">, numItems: number) {
    const songs: Doc<"queuedSongs">[] = await ctx.db
        .query("queuedSongs")
        .withIndex("by_room_type", (q: any) => q.eq("room", roomId))
        .order("asc")
        .collect()

    if (!songs.length) return []

    const room = await ctx.db.get(roomId)
    const currentUserId = room?.currentSong?.addedBy?.toString() || null

    // separate anon/fallback songs from user songs
    const anonQueue: Doc<"queuedSongs">[] = []
    const userQueues: Record<string, Doc<"queuedSongs">[]> = {}

    songs.forEach((song) => {
        const userId = song.addedBy?.toString() ?? "anon"
        if (song.type === "fallback") {
        anonQueue.push(song)
        } else {
        if (!userQueues[userId]) userQueues[userId] = []
        userQueues[userId].push(song)
        }
    })

    const userIds = Object.keys(userQueues).sort()

    // determine starting index
    let startIdx = 0
    if (currentUserId) {
        const idx = userIds.indexOf(currentUserId)
        startIdx = idx >= 0 ? (idx + 1) % userIds.length : 0
    }

    const orderedQueue: Doc<"queuedSongs">[] = []
    let remaining = true
    let count = 0

    while (remaining && count < numItems) {
        remaining = false
        for (let i = 0; i < userIds.length; i++) {
            const uid = userIds[(startIdx + i) % userIds.length]
            const queue = userQueues[uid]
            if (queue.length > 0) {
                orderedQueue.push(queue.shift()!)
                count++
                if (count == numItems) break
                remaining = true
            }
        }
    }

    // append fallback songs at the end if there is space
    if (count < numItems)
        orderedQueue.push(...anonQueue.slice(0, numItems - count))

    return attachNicknames(ctx, orderedQueue)
}

export async function weightedQueue(ctx: any, roomId: Id<"rooms">, numItems: number) {
    const songs: Doc<"queuedSongs">[] = await ctx.db
        .query("queuedSongs")
        .withIndex("by_room_type", (q: any) => q.eq("room", roomId))
        .order("asc")
        .collect()

    if (!songs.length) return []

    const anonQueue: Doc<"queuedSongs">[] = []
    const userQueues: Record<string, Doc<"queuedSongs">[]> = {}

    songs.forEach((song) => {
        const userId = song.addedBy?.toString() ?? "anon"
        if (song.type === "fallback") {
        anonQueue.push(song)
        } else {
        if (!userQueues[userId]) userQueues[userId] = []
        userQueues[userId].push(song)
        }
    })

    const userIds = Object.keys(userQueues)
    if (!userIds.length) return attachNicknames(ctx, anonQueue)

    // get user ratings
    const userRatings: Record<string, number> = {}
    for (const id of userIds) {
        const user: Doc<"users"> = await ctx.db.get(id)
        userRatings[id] = user?.ratingScore ?? 1
    }

    let totalWeight = Object.values(userRatings).reduce((a, b) => a + b, 0)

    const weightedQueue: Doc<"queuedSongs">[] = []
    let count = 0

    // for determinism
    var seedrandom = require('seedrandom');
    var rng = seedrandom.xor128(roomId.toString())

    // naive weighted round-robin
    while (Object.values(userQueues).some(q => q.length > 0) && count < numItems) {
        let r = rng() * totalWeight
        for (const uid of userIds) {
            if (r < userRatings[uid] && userQueues[uid].length > 0) {
                weightedQueue.push(userQueues[uid].shift()!)
                count++
                if (!userQueues[uid].length) 
                    totalWeight -= userRatings[uid]
                break
            }
            r -= userRatings[uid]
            if (count == numItems) break
        }
    }

    // append fallback songs at the end
    if (count < numItems)
        weightedQueue.push(...anonQueue.slice(0, numItems - count))

    return attachNicknames(ctx, weightedQueue)
}

export async function getQueueFCFS(ctx: QueryCtx, roomId: Id<"rooms">, numItems: number) {
    const queue = await fcfsQueue(ctx, roomId, numItems)
    return attachNicknames(ctx, queue)
}

export async function getQueueRoundRobin(ctx: QueryCtx, roomId: Id<"rooms">, numItems: number) {
    const queue = await roundRobinQueue(ctx, roomId, numItems)
    return attachNicknames(ctx, queue)
}

export async function getQueueWeighted(ctx: QueryCtx, roomId: Id<"rooms">, numItems: number) {
    const queue = await weightedQueue(ctx, roomId, numItems)
    return attachNicknames(ctx, queue)
}

export async function getNextSong(ctx: any, roomId: Id<"rooms">): Promise<Doc<"queuedSongs"> | null> {
    const room = await ctx.db.get(roomId)
    if (!room) throw new Error("Room not found")

    // Default to FCFS
    const scheduler = room.settings?.scheduler ?? "roundRobin"

    const queue = await (async () => {
        switch (scheduler) {
            case "FCFS":
                return fcfsQueue(ctx, roomId, 1)
            case "roundRobin":
                return roundRobinQueue(ctx, roomId, 1)
            case "weighted":
                return weightedQueue(ctx, roomId, 1)
            default:
                return fcfsQueue(ctx, roomId, 1)
        }
    })()

    return queue.length ? queue[0] : null
}
