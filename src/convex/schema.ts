import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        // Fields are optional
    }),
    rooms: defineTable({
        host: v.id("users"),
        code: v.string(),
        currentSong: v.optional(v.id("songs")),
    }),
    queuedSongs: defineTable({
        room: v.id("rooms"),
        addedBy: v.id("users"),
        videoId: v.string(),

        title: v.string(),
        artist: v.string(),
        thumbnail: v.string(),
    }),
})
