import { v } from "convex/values"
import { internal } from "./_generated/api"
import type { Doc, Id } from "./_generated/dataModel"
import {
    internalAction,
    internalQuery,
    type ActionCtx,
    type MutationCtx,
} from "./_generated/server"
import { internalMutation } from "./functions"

/*
 * THE CATALOGUE
 *
 * Every other table in this app identifies a song by its YouTube `videoId`,
 * which is worth nothing outside YouTube. This module maintains a parallel,
 * service-agnostic identity for the same recordings so that a night's history
 * can be handed to Spotify, or anywhere else, once the room is over.
 */

/**
 * Bracketed suffixes that describe the *upload* rather than the *recording*.
 *
 * Deliberately short. Stripping "(Live)" or "(Acoustic)" would collapse
 * genuinely different recordings into one catalogue entry, and the whole point
 * of the fingerprint is that two rows mean two different things.
 */
const UPLOAD_NOISE =
    /\((?:official\s+)?(?:music\s+)?(?:video|audio|lyric video|lyrics|visualizer|mv|hd|hq|4k)\)|\[(?:official\s+)?(?:music\s+)?(?:video|audio|lyric video|lyrics|visualizer|mv|hd|hq|4k)\]|\((?:official|explicit)\)/gi

/** "feat. X", "ft X", "featuring X" - credited differently on every service. */
const FEATURING = /\s*[([]?\s*(?:feat|ft|featuring)\.?\s[^)\]]*[)\]]?/gi

/**
 * Collapses a title and artist into a key that survives the same recording
 * being uploaded twice with different decoration.
 *
 * This is intentionally lossy. Its job is to stop the catalogue filling up with
 * near-duplicates, not to be a musicological identity - `isrc` does that job
 * when a provider gives us one.
 */
export function fingerprint(artist: string, title: string): string {
    const normalise = (value: string) =>
        value
            .toLowerCase()
            // Split accents off their letters so the combining marks can be
            // dropped; "Beyoncé" and "Beyonce" have to land on the same key.
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(UPLOAD_NOISE, " ")
            .replace(FEATURING, " ")
            .replace(/[^a-z0-9]+/g, " ")
            .trim()

    return `${normalise(artist)}|${normalise(title)}`
}

/**
 * Finds or creates the catalogue entry for a song, and returns its id.
 *
 * Called on the way into history, so the catalogue only ever contains songs the
 * room actually heard. Newly created entries are queued for resolution against
 * the other streaming services.
 */
export async function upsertTrack(
    ctx: MutationCtx,
    song: {
        videoId: string
        title: string
        artist: string
        duration: number
    },
): Promise<Id<"tracks">> {
    const key = fingerprint(song.artist, song.title)

    const existing = await ctx.db
        .query("tracks")
        .withIndex("by_fingerprint", (q) => q.eq("fingerprint", key))
        .first()

    if (existing) {
        // A song we first saw through some other upload now has a YouTube id.
        if (!existing.providerIds.youtube) {
            await ctx.db.patch(existing._id, {
                providerIds: {
                    ...existing.providerIds,
                    youtube: song.videoId,
                },
            })
        }
        return existing._id
    }

    const trackId = await ctx.db.insert("tracks", {
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        fingerprint: key,
        providerIds: { youtube: song.videoId },
    })

    // Resolution is a network call, so it can't happen inside the mutation.
    // Nothing waits on it: a track without links is still perfectly playable,
    // it just can't be exported until this lands.
    await ctx.scheduler.runAfter(0, internal.tracks.resolveTrack, { trackId })

    return trackId
}

/*
 * RESOLUTION
 *
 * Odesli (song.link) takes a URL on one service and returns the same recording
 * on every service it knows about. That is exactly the matching problem we'd
 * otherwise have to solve ourselves with fuzzy search, and it's free and
 * unauthenticated - at the cost of a fairly tight rate limit, which is why
 * results are cached on the track forever.
 */

const ODESLI_ENDPOINT = "https://api.song.link/v1-alpha.1/links"

/** Odesli asks for well under one request a second from anonymous callers. */
const ODESLI_RETRY_MS = 60 * 1000
const ODESLI_MAX_ATTEMPTS = 3

/** Maps Odesli's `entityUniqueId` prefixes onto our `providerIds` keys. */
const ENTITY_PREFIX_TO_PROVIDER: Record<string, string> = {
    SPOTIFY_SONG: "spotify",
    ITUNES_SONG: "appleMusic",
    DEEZER_SONG: "deezer",
    TIDAL_SONG: "tidal",
}

export const getTrack = internalQuery({
    args: { trackId: v.id("tracks") },
    handler: async (ctx, args) => await ctx.db.get(args.trackId),
})

export const saveResolution = internalMutation({
    args: {
        trackId: v.id("tracks"),
        links: v.record(v.string(), v.string()),
        providerIds: v.object({
            youtube: v.optional(v.string()),
            spotify: v.optional(v.string()),
            appleMusic: v.optional(v.string()),
            deezer: v.optional(v.string()),
            tidal: v.optional(v.string()),
        }),
        isrc: v.optional(v.string()),
        unresolvable: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const track = await ctx.db.get(args.trackId)
        if (!track) return

        await ctx.db.patch(args.trackId, {
            // Keep whatever we already knew; resolution only ever adds.
            providerIds: { ...track.providerIds, ...args.providerIds },
            links: { ...(track.links ?? {}), ...args.links },
            isrc: args.isrc ?? track.isrc,
            resolvedAt: Date.now(),
            unresolvable: args.unresolvable,
        })
    },
})

export const resolveTrack = internalAction({
    args: {
        trackId: v.id("tracks"),
        attempt: v.optional(v.number()),
    },
    // The return type is written out because this action reschedules itself,
    // and TypeScript can't infer through that cycle.
    handler: async (ctx, args): Promise<void> => {
        const attempt = args.attempt ?? 1

        const track: Doc<"tracks"> | null = await ctx.runQuery(
            internal.tracks.getTrack,
            { trackId: args.trackId },
        )
        if (!track) return

        const videoId = track.providerIds.youtube
        if (!videoId) return

        const url = `${ODESLI_ENDPOINT}?${new URLSearchParams({
            url: `https://www.youtube.com/watch?v=${videoId}`,
            userCountry: "US",
            songIfSingle: "true",
        })}`

        let response: Response
        try {
            response = await fetch(url, {
                headers: { Accept: "application/json" },
            })
        } catch (error) {
            console.error(`Odesli request failed for ${videoId}`, error)
            await retry(ctx, args.trackId, attempt)
            return
        }

        if (response.status === 429) {
            await retry(ctx, args.trackId, attempt)
            return
        }

        if (!response.ok) {
            // 404 means Odesli has never heard of this upload, which is common
            // for user uploads. Nothing to retry - record the miss so exports
            // don't keep asking.
            await ctx.runMutation(internal.tracks.saveResolution, {
                trackId: args.trackId,
                links: {},
                providerIds: {},
                unresolvable: true,
            })
            return
        }

        const body = (await response.json()) as OdesliResponse
        const { links, providerIds, isrc } = readOdesli(body)

        await ctx.runMutation(internal.tracks.saveResolution, {
            trackId: args.trackId,
            links,
            providerIds,
            isrc,
            unresolvable: Object.keys(links).length === 0,
        })
    },
})

async function retry(
    ctx: ActionCtx,
    trackId: Id<"tracks">,
    attempt: number,
): Promise<void> {
    if (attempt >= ODESLI_MAX_ATTEMPTS) return

    await ctx.scheduler.runAfter(
        // Back off linearly. The limit is per-IP and shared with every other
        // room on this deployment, so hammering it just starves everyone.
        ODESLI_RETRY_MS * attempt,
        internal.tracks.resolveTrack,
        { trackId, attempt: attempt + 1 },
    )
}

type OdesliResponse = {
    linksByPlatform?: Record<string, { url?: string; entityUniqueId?: string }>
    entitiesByUniqueId?: Record<
        string,
        { id?: string; isrc?: string; title?: string; artistName?: string }
    >
}

/** Pulls the web links, per-service ids and ISRC out of an Odesli payload. */
function readOdesli(body: OdesliResponse) {
    const links: Record<string, string> = {}
    const providerIds: Record<string, string> = {}
    let isrc: string | undefined

    for (const [platform, entry] of Object.entries(
        body.linksByPlatform ?? {},
    )) {
        if (entry?.url) links[platform] = entry.url

        const uniqueId = entry?.entityUniqueId
        if (!uniqueId) continue

        const [prefix, id] = uniqueId.split("::")
        const provider = ENTITY_PREFIX_TO_PROVIDER[prefix]
        if (provider && id) providerIds[provider] = id
    }

    // Any entity will do - an ISRC identifies the recording, not the service.
    for (const entity of Object.values(body.entitiesByUniqueId ?? {})) {
        if (entity?.isrc) {
            isrc = entity.isrc
            break
        }
    }

    return { links, providerIds, isrc }
}
