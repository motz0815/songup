import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        // Fields are optional
    }),
    rooms: defineTable({
        host: v.id("users"),
        code: v.string(),
        expiresAt: v.number(),
        currentSong: v.optional(v.id("songs")),
        settings: v.object({
            maxSongsPerUser: v.number(),
        }),
    })
        .index("by_code", ["code"])
        .index("by_host", ["host"]),
    queuedSongs: defineTable({
        room: v.id("rooms"),
        addedBy: v.id("users"),
        videoId: v.string(),
        type: v.union(v.literal("user"), v.literal("fallback")),

        title: v.string(),
        artist: v.string(),
        thumbnail: v.string(),
    })
        .index("by_room", ["room"])
        .index("by_type", ["type"]),
})
