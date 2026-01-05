import { Id, Doc } from "./_generated/dataModel"
import type { QueryCtx } from "./_generated/server"

export async function attachNicknames(ctx: any, songs: Doc<"queuedSongs">[]) {
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
