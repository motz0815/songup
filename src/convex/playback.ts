import { internal } from "./_generated/api"
import { Doc, Id } from "./_generated/dataModel"
import type { MutationCtx } from "./_generated/server"
import { tallyVoteDocs } from "./ratings"
import { getNextSong } from "./scheduling"

/**
 * Ends the room's current song and starts the next one.
 *
 * Shared by every path that can advance a room - the host's player reaching the
 * end of a song, the host skipping manually, and listeners voting to skip - so
 * that history, vote cleanup and playlist archiving happen exactly once no
 * matter who triggered it.
 */
export async function advanceRoom(
    ctx: MutationCtx,
    roomId: Id<"rooms">,
): Promise<Doc<"queuedSongs"> | null> {
    const room = await ctx.db.get(roomId)
    if (!room) {
        throw new Error("Room not found")
    }

    const oldSong = room.currentSong

    if (oldSong) {
        // Freeze the song's votes onto its history row. Ratings read these
        // totals afterwards, so the live votes can be cleared away.
        const votes = await ctx.db
            .query("songVotes")
            .withIndex("by_room_video", (q) =>
                q.eq("room", roomId).eq("videoId", oldSong.videoId),
            )
            .collect()

        const { likes, dislikes } = tallyVoteDocs(votes)

        await ctx.db.insert("history", {
            room: roomId,
            ...oldSong,
            likes,
            dislikes,
        })

        for (const vote of votes) {
            await ctx.db.delete(vote._id)
        }
    }

    await clearSkipVotes(ctx, roomId, oldSong?.videoId)

    const nextSong = await getNextSong(ctx, roomId)

    if (nextSong) {
        // Copy only the song fields; the queue doc also carries Convex metadata
        // and a room reference that don't belong on the room.
        const { addedBy, type, videoId, title, artist, duration } = nextSong
        await ctx.db.patch(roomId, {
            currentSong: { addedBy, type, videoId, title, artist, duration },
        })
        await ctx.db.delete(nextSong._id)
    } else {
        await ctx.db.patch(roomId, { currentSong: undefined })
    }

    if (oldSong && room.playlistId) {
        // @ts-ignore
        await ctx.scheduler.runAfter(0, internal.functions.addSongToPlaylist, {
            roomId,
            videoId: oldSong.videoId,
            playlistId: room.playlistId,
        })
    }

    return nextSong
}

/** Drops skip votes for a song so they can't count towards the next one. */
export async function clearSkipVotes(
    ctx: MutationCtx,
    roomId: Id<"rooms">,
    videoId: string | undefined,
) {
    if (!videoId) return

    const votes = await ctx.db
        .query("skipVotes")
        .withIndex("by_room_video", (q) =>
            q.eq("room", roomId).eq("videoId", videoId),
        )
        .collect()

    for (const vote of votes) {
        await ctx.db.delete(vote._id)
    }
}
