import type { Doc, Id } from "./_generated/dataModel"
import type { QueryCtx } from "./_generated/server"
import { BASE_WEIGHT, weightFromScore } from "./settings"

export type UserRating = {
    /** Net upvotes minus downvotes inside the forget window. */
    score: number
    likes: number
    dislikes: number
    /** How many of the user's songs the score was computed from. */
    songsCounted: number
    /** Scheduling weight derived from the score. Always >= MIN_WEIGHT. */
    weight: number
}

export const NEUTRAL_RATING: UserRating = {
    score: 0,
    likes: 0,
    dislikes: 0,
    songsCounted: 0,
    weight: BASE_WEIGHT,
}

/**
 * Computes a user's rating within one room.
 *
 * Only the user's `numSongsToForget` most recently played songs count, so a bad
 * run early in the night stops following them around. `numSongsToForget` of -1
 * means the whole room history counts.
 *
 * Votes on the song currently playing are included too, so the rating responds
 * while a song is still on screen rather than only once it has been popped.
 */
export async function getUserRating(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
    userId: Id<"users">,
    numSongsToForget: number,
): Promise<UserRating> {
    const room = await ctx.db.get(roomId)

    let likes = 0
    let dislikes = 0
    let songsCounted = 0

    // Votes on the song that is playing right now aren't in history yet.
    const currentSong = room?.currentSong
    if (currentSong && currentSong.addedBy === userId) {
        const tally = await tallySongVotes(ctx, roomId, currentSong.videoId)
        likes += tally.likes
        dislikes += tally.dislikes
        songsCounted += 1
    }

    const remaining =
        numSongsToForget < 0
            ? Number.POSITIVE_INFINITY
            : numSongsToForget - songsCounted

    if (remaining > 0) {
        const played = await ctx.db
            .query("history")
            .withIndex("by_room_added_by", (q) =>
                q.eq("room", roomId).eq("addedBy", userId),
            )
            .order("desc")
            .take(Number.isFinite(remaining) ? remaining : 200)

        for (const entry of played) {
            likes += entry.likes ?? 0
            dislikes += entry.dislikes ?? 0
            songsCounted += 1
        }
    }

    const score = likes - dislikes

    return {
        score,
        likes,
        dislikes,
        songsCounted,
        weight: weightFromScore(score),
    }
}

/** Ratings for several users at once, keyed by user id. */
export async function getUserRatings(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
    userIds: Id<"users">[],
    numSongsToForget: number,
): Promise<Record<string, UserRating>> {
    const ratings = await Promise.all(
        userIds.map((userId) =>
            getUserRating(ctx, roomId, userId, numSongsToForget),
        ),
    )

    return Object.fromEntries(
        userIds.map((userId, index) => [userId, ratings[index]]),
    )
}

/** Counts the up and down votes cast on one song in one room. */
export async function tallySongVotes(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
    videoId: string,
): Promise<{ likes: number; dislikes: number }> {
    const votes = await ctx.db
        .query("songVotes")
        .withIndex("by_room_video", (q) =>
            q.eq("room", roomId).eq("videoId", videoId),
        )
        .collect()

    return tallyVoteDocs(votes)
}

export function tallyVoteDocs(votes: Doc<"songVotes">[]): {
    likes: number
    dislikes: number
} {
    let likes = 0
    let dislikes = 0
    for (const vote of votes) {
        if (vote.value === 1) likes += 1
        else dislikes += 1
    }
    return { likes, dislikes }
}
