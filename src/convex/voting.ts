import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { query, QueryCtx } from "./_generated/server"
import { mutation } from "./functions"
import { advanceRoom } from "./playback"
import { getUserRating } from "./ratings"
import {
    DEFAULT_SKIP_THRESHOLD,
    PRESENCE_WINDOW_MS,
    votesRequired,
} from "./settings"

/*
 * PRESENCE
 *
 * The skip threshold is a share of the people in the room, so we need to know
 * who is actually there. Listeners check in from the room page while it's open.
 */

export const heartbeat = mutation({
    args: { roomId: v.id("rooms") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return

        const existing = await ctx.db
            .query("roomMembers")
            .withIndex("by_room_user", (q) =>
                q.eq("room", args.roomId).eq("user", userId as Id<"users">),
            )
            .unique()

        if (existing) {
            await ctx.db.patch(existing._id, { lastSeenAt: Date.now() })
        } else {
            await ctx.db.insert("roomMembers", {
                room: args.roomId,
                user: userId as Id<"users">,
                lastSeenAt: Date.now(),
            })
        }
    },
})

async function countActiveListeners(
    ctx: QueryCtx,
    roomId: Id<"rooms">,
): Promise<number> {
    const cutoff = Date.now() - PRESENCE_WINDOW_MS
    const members = await ctx.db
        .query("roomMembers")
        .withIndex("by_room", (q) => q.eq("room", roomId))
        .collect()

    return members.filter((member) => member.lastSeenAt >= cutoff).length
}

/*
 * SKIP VOTES
 */

export const getSkipStatus = query({
    args: { roomId: v.id("rooms") },
    handler: async (ctx, args) => {
        const room = await ctx.db.get(args.roomId)
        if (!room?.currentSong) return null

        const userId = await getAuthUserId(ctx)
        const threshold = room.settings.skipThreshold ?? DEFAULT_SKIP_THRESHOLD
        const activeListeners = await countActiveListeners(ctx, args.roomId)

        const votes = await ctx.db
            .query("skipVotes")
            .withIndex("by_room_video", (q) =>
                q
                    .eq("room", args.roomId)
                    .eq("videoId", room.currentSong!.videoId),
            )
            .collect()

        return {
            videoId: room.currentSong.videoId,
            votes: votes.length,
            required: votesRequired(activeListeners, threshold),
            activeListeners,
            threshold,
            hasVoted: userId
                ? votes.some((vote) => vote.user === userId)
                : false,
        }
    },
})

/**
 * Casts or withdraws a vote to skip the song playing now. Once the threshold is
 * reached the room advances immediately, from inside this same mutation, so the
 * skip doesn't depend on the host screen noticing.
 */
export const voteToSkip = mutation({
    args: {
        roomId: v.id("rooms"),
        videoId: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("You need to join the room before voting")
        }

        const room = await ctx.db.get(args.roomId)
        if (!room) {
            throw new Error("Room not found")
        }

        // The song may have changed between the page rendering and the click.
        if (room.currentSong?.videoId !== args.videoId) {
            return { skipped: false, votes: 0, required: 0 }
        }

        const existing = await ctx.db
            .query("skipVotes")
            .withIndex("by_room_video_user", (q) =>
                q
                    .eq("room", args.roomId)
                    .eq("videoId", args.videoId)
                    .eq("user", userId as Id<"users">),
            )
            .unique()

        if (existing) {
            await ctx.db.delete(existing._id)
        } else {
            await ctx.db.insert("skipVotes", {
                room: args.roomId,
                videoId: args.videoId,
                user: userId as Id<"users">,
            })
        }

        const votes = await ctx.db
            .query("skipVotes")
            .withIndex("by_room_video", (q) =>
                q.eq("room", args.roomId).eq("videoId", args.videoId),
            )
            .collect()

        const threshold = room.settings.skipThreshold ?? DEFAULT_SKIP_THRESHOLD
        const required = votesRequired(
            await countActiveListeners(ctx, args.roomId),
            threshold,
        )

        if (votes.length >= required) {
            await advanceRoom(ctx, args.roomId)
            return { skipped: true, votes: votes.length, required }
        }

        return { skipped: false, votes: votes.length, required }
    },
})

/*
 * SONG RATINGS
 *
 * Votes are only cast on the song that is playing. Once it ends the totals are
 * frozen onto its history row, which keeps the rating window well defined and
 * stops a song being re-litigated an hour later.
 */

export const getCurrentSongVotes = query({
    args: { roomId: v.id("rooms") },
    handler: async (ctx, args) => {
        const room = await ctx.db.get(args.roomId)
        if (!room?.currentSong) return null

        const userId = await getAuthUserId(ctx)

        const votes = await ctx.db
            .query("songVotes")
            .withIndex("by_room_video", (q) =>
                q
                    .eq("room", args.roomId)
                    .eq("videoId", room.currentSong!.videoId),
            )
            .collect()

        const myVote = userId
            ? (votes.find((vote) => vote.voter === userId)?.value ?? null)
            : null

        return {
            videoId: room.currentSong.videoId,
            likes: votes.filter((vote) => vote.value === 1).length,
            dislikes: votes.filter((vote) => vote.value === -1).length,
            myVote,
            // Self-voting would let anyone inflate their own scheduling weight.
            canVote: Boolean(userId) && room.currentSong.addedBy !== userId,
        }
    },
})

export const voteOnCurrentSong = mutation({
    args: {
        roomId: v.id("rooms"),
        videoId: v.string(),
        value: v.union(v.literal(1), v.literal(-1)),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("You need to join the room before voting")
        }

        const room = await ctx.db.get(args.roomId)
        if (!room) {
            throw new Error("Room not found")
        }

        const currentSong = room.currentSong
        if (currentSong?.videoId !== args.videoId) {
            throw new Error("That song is no longer playing")
        }

        if (currentSong.addedBy === userId) {
            throw new Error("You can't vote on your own song")
        }

        const existing = await ctx.db
            .query("songVotes")
            .withIndex("by_room_video_voter", (q) =>
                q
                    .eq("room", args.roomId)
                    .eq("videoId", args.videoId)
                    .eq("voter", userId as Id<"users">),
            )
            .unique()

        if (!existing) {
            await ctx.db.insert("songVotes", {
                room: args.roomId,
                videoId: args.videoId,
                voter: userId as Id<"users">,
                songOwner: currentSong.addedBy,
                value: args.value,
            })
        } else if (existing.value === args.value) {
            // Clicking the same button again takes the vote back.
            await ctx.db.delete(existing._id)
        } else {
            await ctx.db.patch(existing._id, { value: args.value })
        }
    },
})

/*
 * RATINGS
 */

/** The signed-in listener's own rating in this room, for the room page. */
export const getMyRating = query({
    args: { roomId: v.id("rooms") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null

        const room = await ctx.db.get(args.roomId)
        if (!room) return null

        return await getUserRating(
            ctx,
            args.roomId,
            userId as Id<"users">,
            room.settings.numSongsToForget,
        )
    },
})

/**
 * Every rated listener in the room, best first. Drives the host screen's
 * standings panel when the DemocraSchedule scheduler is running.
 */
export const getRoomRatings = query({
    args: { roomId: v.id("rooms") },
    handler: async (ctx, args) => {
        const room = await ctx.db.get(args.roomId)
        if (!room) return []

        const members = await ctx.db
            .query("roomMembers")
            .withIndex("by_room", (q) => q.eq("room", args.roomId))
            .collect()

        const cutoff = Date.now() - PRESENCE_WINDOW_MS

        const standings = await Promise.all(
            members.map(async (member) => {
                const user = await ctx.db.get(member.user)
                const rating = await getUserRating(
                    ctx,
                    args.roomId,
                    member.user,
                    room.settings.numSongsToForget,
                )
                return {
                    userId: member.user,
                    nickname: user?.nickname,
                    active: member.lastSeenAt >= cutoff,
                    ...rating,
                }
            }),
        )

        // Nobody who hasn't had a song played yet is interesting to rank.
        return standings
            .filter((entry) => entry.songsCounted > 0)
            .sort(
                (a, b) =>
                    b.score - a.score || b.songsCounted - a.songsCounted,
            )
    },
})
