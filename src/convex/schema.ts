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
        ...song,
    })
        .index("by_room", ["room"])
        // Used to walk a user's most recent songs when computing their rating.
        .index("by_room_added_by", ["room", "addedBy"]),

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
     * Votes to skip the song playing right now. `videoId` scopes a vote to the
     * song it was cast for, so votes can never leak into the next song.
     */
    skipVotes: defineTable({
        room: v.id("rooms"),
        user: v.id("users"),
        videoId: v.string(),
    })
        .index("by_room_video", ["room", "videoId"])
        .index("by_room_video_user", ["room", "videoId", "user"]),

    /**
     * Up/down votes on a song. These drive the rating of the user who added it,
     * which the DemocraSchedule scheduler turns into queue weight.
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
        .index("by_room_video_voter", ["room", "videoId", "voter"])
        .index("by_room_owner", ["room", "songOwner"]),
})
