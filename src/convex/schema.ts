import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        nickname: v.optional(v.string()),
    }),
    rooms: defineTable({
        host: v.id("users"),
        code: v.string(),
        expiresAt: v.number(),
        settings: v.object({
            maxSongsPerUser: v.number(),
        }),
    })
        .index("by_code", ["code"])
        .index("by_host", ["host"]),
    queuedSongs: defineTable({
        room: v.id("rooms"),
        addedBy: v.optional(v.id("users")),
        videoId: v.string(),
        // These exact names of types are important
        // because the queue query will use them to sort the songs.
        // Calling user added songs "addedByUser" places them in front of fallback songs.
        type: v.union(v.literal("addedByUser"), v.literal("fallback")),

        title: v.string(),
        artist: v.string(),
        thumbnail: v.string(),
    })
        .index("by_room_type", ["room", "type"])
        .index("by_added_by_room", ["addedBy", "room"]),
})
