import { v } from "convex/values"
import type { Doc, Id } from "./_generated/dataModel"
import { query } from "./_generated/server"

/**
 * The room's history in a shape something other than YouTube can use.
 *
 * Each entry carries whatever identity we managed to resolve for the recording,
 * so a client can hand the list to another service without knowing anything
 * about how the song got into the room.
 */
export type ExportedTrack = {
    /** Stable key for React lists and for tracking export progress. */
    key: string
    title: string
    artist: string
    /** Seconds. Used to check that a search result is the right recording. */
    duration: number
    videoId: string
    /** Number of times the room played it. */
    plays: number
    isrc?: string
    spotifyId?: string
    /** Public per-service web links, keyed by Odesli's platform names. */
    links?: Record<string, string>
}

export const getRoomExport = query({
    args: { roomId: v.id("rooms") },
    handler: async (ctx, args): Promise<ExportedTrack[]> => {
        const history = await ctx.db
            .query("history")
            .withIndex("by_room", (q) => q.eq("room", args.roomId))
            .order("asc")
            .collect()

        // One track can be looked up by many history rows, and a popular song
        // gets played more than once a night.
        const trackCache = new Map<string, Doc<"tracks"> | null>()
        const byKey = new Map<string, ExportedTrack>()

        for (const played of history) {
            let track: Doc<"tracks"> | null = null
            if (played.track) {
                const cached = trackCache.get(played.track)
                if (cached !== undefined) {
                    track = cached
                } else {
                    track = await ctx.db.get(played.track as Id<"tracks">)
                    trackCache.set(played.track, track)
                }
            }

            // Rows written before the catalogue existed have no track, and
            // fall back to being identified by the video they came from.
            const key = played.track ?? played.videoId

            const existing = byKey.get(key)
            if (existing) {
                existing.plays += 1
                continue
            }

            byKey.set(key, {
                key,
                title: track?.title ?? played.title,
                artist: track?.artist ?? played.artist,
                duration: track?.duration ?? played.duration,
                videoId: played.videoId,
                plays: 1,
                isrc: track?.isrc,
                spotifyId: track?.providerIds.spotify,
                links: track?.links,
            })
        }

        return [...byKey.values()]
    },
})
