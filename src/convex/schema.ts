import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

// This is a shared object defining the fields for a song.
const song = {
    addedBy: v.optional(v.id("users")),
    videoId: v.string(),
    // These exact names of types are important
    // because the queue query will use them to sort the songs.
    // Calling user added songs "addedByUser" places them in front of fallback songs.
    type: v.union(v.literal("addedByUser"), v.literal("fallback")),

    title: v.string(),
    artist: v.string(),
    duration: v.number(),
}

export const schedulerValidator = v.union(
    v.literal("FCFS"),
    v.literal("roundRobin"),
    v.literal("weighted"),
)

export default defineSchema({
    ...authTables,
    users: defineTable({
        // Default fields
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),

        // Custom fields
        nickname: v.optional(v.string()),
        // Legacy. Ratings are scoped to a room and computed from that room's
        // votes (see `ratings.ts`); this global field is no longer read.
        ratingScore: v.optional(v.number()),
    }),
    rooms: defineTable({
        host: v.id("users"),
        code: v.string(),
        expiresAt: v.number(),
        currentSong: v.optional(v.object(song)),
        playlistId: v.optional(v.string()),
        settings: v.object({
            maxSongsPerUser: v.number(),
            scheduler: schedulerValidator,
            // How many of a user's most recently played songs still count
            // towards their rating. -1 means never forget.
            numSongsToForget: v.number(),
            // Fraction of listeners who must vote to skip before the current
            // song is dropped. Absent on rooms created before voting existed.
            skipThreshold: v.optional(v.number()),
        }),
    })
        .index("by_code", ["code"])
        .index("by_host", ["host"])
        .index("by_expires_at", ["expiresAt"]),

    queuedSongs: defineTable({
        room: v.id("rooms"),
        userQueuePosition: v.optional(v.number()),
        ...song,
    })
        .index("by_room_type", ["room", "type"])
        .index("by_added_by_room", ["addedBy", "room"])
        .index("by_room_userQueuePosition", [
            "room",
            "addedBy",
            "userQueuePosition",
        ]),

    history: defineTable({
        room: v.id("rooms"),
        likes: v.optional(v.number()),
        dislikes: v.optional(v.number()),
        /**
         * The catalogue entry this play refers to. Optional because rows
         * written before the catalogue existed don't have one, and because a
         * play is still worth recording even if the upsert fails.
         */
        track: v.optional(v.id("tracks")),
        ...song,
    })
        .index("by_room", ["room"])
        // Used to walk a user's most recent songs when computing their rating.
        .index("by_room_added_by", ["room", "addedBy"]),

    /**
     * A service-agnostic catalogue of recordings.
     *
     * Everything else in the app is keyed on a YouTube `videoId`, which is
     * meaningless to Spotify or anyone else. This table is the identity that
     * survives leaving YouTube: it holds what a recording *is*, plus whatever
     * per-service ids we've managed to resolve for it.
     */
    tracks: defineTable({
        title: v.string(),
        artist: v.string(),
        /** Seconds. Used to verify matches when resolving by search. */
        duration: v.number(),
        /**
         * Normalised "artist|title", the key used to collapse the same
         * recording arriving from different uploads. See `tracks.fingerprint`.
         */
        fingerprint: v.string(),
        /** The industry-standard recording id, when a provider gives us one. */
        isrc: v.optional(v.string()),
        /** Per-service ids, filled in lazily as resolution succeeds. */
        providerIds: v.object({
            youtube: v.optional(v.string()),
            spotify: v.optional(v.string()),
            appleMusic: v.optional(v.string()),
            deezer: v.optional(v.string()),
            tidal: v.optional(v.string()),
        }),
        /** Public per-service web links, keyed by Odesli's platform names. */
        links: v.optional(v.record(v.string(), v.string())),
        /** When resolution last ran. Absent means it never has. */
        resolvedAt: v.optional(v.number()),
        /**
         * Set when resolution ran but found nothing, so we don't retry a
         * hopeless track on every export.
         */
        unresolvable: v.optional(v.boolean()),
    })
        .index("by_fingerprint", ["fingerprint"])
        .index("by_isrc", ["isrc"]),

    /**
     * Presence. Listeners heartbeat while they have the room page open so the
     * skip threshold can be a share of the people actually in the room rather
     * than of everyone who ever joined.
     */
    roomMembers: defineTable({
        room: v.id("rooms"),
        user: v.id("users"),
        lastSeenAt: v.number(),
    })
        .index("by_room", ["room"])
        .index("by_room_user", ["room", "user"]),

    /**
     * The room's only vote. One per listener per song.
     *
     * A vote does two jobs at once: it moves the rating of whoever added the
     * song, and - when it's a downvote - it counts towards ending the song
     * early. There is deliberately no separate "skip" ballot; disliking a song
     * and wanting it gone are the same opinion, and splitting them made people
     * cast one and forget the other.
     *
     * `videoId` scopes a vote to the song it was cast for, so votes can never
     * leak into whatever plays next.
     */
    songVotes: defineTable({
        room: v.id("rooms"),
        videoId: v.string(),
        voter: v.id("users"),
        // The user whose rating this vote affects. Absent for fallback songs,
        // which nobody owns.
        songOwner: v.optional(v.id("users")),
        value: v.union(v.literal(1), v.literal(-1)),
    })
        .index("by_room_video", ["room", "videoId"])
        .index("by_room_video_voter", ["room", "videoId", "voter"]),
})
