import { Doc, Id } from "./_generated/dataModel"
import type { QueryCtx } from "./_generated/server"
import { BASE_WEIGHT, getUserRatings } from "./ratings"

export type QueuedSong = Doc<"queuedSongs"> & {
    addedByNickname: string | undefined
}

/** Key used to bucket songs by the user who added them. */
const ANONYMOUS = "anon"

export async function attachNicknames(
    ctx: QueryCtx,
    songs: Doc<"queuedSongs">[],
): Promise<QueuedSong[]> {
    const nicknames = new Map<string, string | undefined>()

    for (const song of songs) {
        if (!song.addedBy || nicknames.has(song.addedBy)) continue
        const user = await ctx.db.get(song.addedBy)
        nicknames.set(song.addedBy, user?.nickname)
    }

    return songs.map((song) => ({
        ...song,
        addedByNickname: song.addedBy ? nicknames.get(song.addedBy) : undefined,
    }))
}

/**
 * Every song waiting in a room, oldest first.
 *
 * The `by_room_type` index sorts by (room, type, _creationTime), and
 * "addedByUser" sorts before "fallback", so user songs always come out ahead of
 * the host's fallback playlist. The schedulers below rely on that ordering.
 */
async function collectQueue(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
): Promise<Doc<"queuedSongs">[]> {
    return await ctx.db
        .query("queuedSongs")
        .withIndex("by_room_type", (q) => q.eq("room", roomId))
        .order("asc")
        .collect()
}

/** Splits a queue into per-user buckets plus the unowned fallback songs. */
function bucketByUser(songs: Doc<"queuedSongs">[]): {
    userQueues: Map<string, Doc<"queuedSongs">[]>
    fallback: Doc<"queuedSongs">[]
} {
    const userQueues = new Map<string, Doc<"queuedSongs">[]>()
    const fallback: Doc<"queuedSongs">[] = []

    for (const song of songs) {
        if (song.type === "fallback") {
            fallback.push(song)
            continue
        }
        const key = song.addedBy ?? ANONYMOUS
        const bucket = userQueues.get(key)
        if (bucket) bucket.push(song)
        else userQueues.set(key, [song])
    }

    return { userQueues, fallback }
}

/**
 * First come, first served: the queue in the order it was added.
 */
export async function fcfsQueue(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
    numItems: number,
): Promise<Doc<"queuedSongs">[]> {
    return await ctx.db
        .query("queuedSongs")
        .withIndex("by_room_type", (q) => q.eq("room", roomId))
        .order("asc")
        .take(numItems)
}

/**
 * Round robin: one song from each user in turn, so nobody can monopolise the
 * room by queueing ten songs at once.
 *
 * Turn order starts after whoever added the song that is playing, so the
 * rotation carries across songs instead of restarting each time.
 */
export async function roundRobinQueue(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
    numItems: number,
): Promise<Doc<"queuedSongs">[]> {
    const songs = await collectQueue(ctx, roomId)
    if (!songs.length) return []

    const { userQueues, fallback } = bucketByUser(songs)
    const userIds = [...userQueues.keys()].sort()

    if (!userIds.length) return fallback.slice(0, numItems)

    const room = await ctx.db.get(roomId)
    const currentUserId = room?.currentSong?.addedBy ?? null

    // Resume the rotation just after the user who is playing now.
    let startIdx = 0
    if (currentUserId) {
        const idx = userIds.indexOf(currentUserId)
        if (idx >= 0) startIdx = (idx + 1) % userIds.length
    }

    const ordered: Doc<"queuedSongs">[] = []
    let exhausted = false

    while (ordered.length < numItems && !exhausted) {
        exhausted = true
        for (let i = 0; i < userIds.length && ordered.length < numItems; i++) {
            const bucket = userQueues.get(
                userIds[(startIdx + i) % userIds.length],
            )!
            const next = bucket.shift()
            if (next) {
                ordered.push(next)
                exhausted = false
            }
        }
    }

    // Fallback songs only fill space the users didn't.
    if (ordered.length < numItems) {
        ordered.push(...fallback.slice(0, numItems - ordered.length))
    }

    return ordered
}

/**
 * DemocraSchedule: round robin weighted by each user's voting record.
 *
 * Uses smooth weighted round robin (the algorithm nginx uses for upstreams).
 * Each pass adds every user's weight to their credit, the user with the most
 * credit plays next, and their credit drops by the total weight. Well-rated
 * users get proportionally more turns while everyone still gets interleaved
 * rather than one user playing a whole block.
 *
 * This is deliberately deterministic. The queue is a live query that re-runs on
 * every room update, so a random ordering would reshuffle the displayed queue
 * under the listeners' feet.
 */
export async function weightedQueue(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
    numItems: number,
): Promise<Doc<"queuedSongs">[]> {
    const songs = await collectQueue(ctx, roomId)
    if (!songs.length) return []

    const { userQueues, fallback } = bucketByUser(songs)
    const userIds = [...userQueues.keys()].sort()

    if (!userIds.length) return fallback.slice(0, numItems)

    const room = await ctx.db.get(roomId)
    const numSongsToForget = room?.settings?.numSongsToForget ?? -1

    // Anonymous songs have no owner to rate, so they sit at the base weight.
    const ratedUserIds = userIds.filter(
        (id): id is Id<"users"> => id !== ANONYMOUS,
    )
    const ratings = await getUserRatings(
        ctx,
        roomId,
        ratedUserIds,
        numSongsToForget,
    )

    const weights = new Map<string, number>(
        userIds.map((id) => [id, ratings[id]?.weight ?? BASE_WEIGHT]),
    )
    const totalWeight = [...weights.values()].reduce((a, b) => a + b, 0)

    // Push the user who is playing right now to the back of the first pass, so
    // they don't immediately follow themselves.
    const credit = new Map<string, number>(userIds.map((id) => [id, 0]))
    const currentUserId = room?.currentSong?.addedBy
    if (currentUserId && credit.has(currentUserId)) {
        credit.set(currentUserId, -(weights.get(currentUserId) ?? BASE_WEIGHT))
    }

    const ordered: Doc<"queuedSongs">[] = []

    while (ordered.length < numItems) {
        let chosen: string | null = null
        let best = -Infinity

        for (const userId of userIds) {
            if (!userQueues.get(userId)?.length) continue

            const next = credit.get(userId)! + weights.get(userId)!
            credit.set(userId, next)
            if (next > best) {
                best = next
                chosen = userId
            }
        }

        // Every user is out of songs.
        if (chosen === null) break

        credit.set(chosen, credit.get(chosen)! - totalWeight)
        ordered.push(userQueues.get(chosen)!.shift()!)
    }

    if (ordered.length < numItems) {
        ordered.push(...fallback.slice(0, numItems - ordered.length))
    }

    return ordered
}

/**
 * Runs the room's configured scheduler. FCFS is the fallback for rooms whose
 * settings predate a scheduler being stored.
 */
export async function scheduleQueue(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
    numItems: number,
): Promise<Doc<"queuedSongs">[]> {
    if (numItems <= 0) return []

    const room = await ctx.db.get(roomId)
    const scheduler = room?.settings?.scheduler ?? "FCFS"

    switch (scheduler) {
        case "roundRobin":
            return roundRobinQueue(ctx, roomId, numItems)
        case "weighted":
            return weightedQueue(ctx, roomId, numItems)
        case "FCFS":
        default:
            return fcfsQueue(ctx, roomId, numItems)
    }
}

/** The scheduled queue, enriched with the nicknames the UI displays. */
export async function getScheduledQueue(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
    numItems: number,
): Promise<QueuedSong[]> {
    return attachNicknames(ctx, await scheduleQueue(ctx, roomId, numItems))
}

/** The single song the room should play next, or null if nothing is queued. */
export async function getNextSong(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
): Promise<Doc<"queuedSongs"> | null> {
    const queue = await scheduleQueue(ctx, roomId, 1)
    return queue[0] ?? null
}
