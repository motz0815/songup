import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        // Fields are optional
    }),
    rooms: defineTable({
        host: v.id("users"),
        code: v.string(),
    }),
    queuedSongs: defineTable({
        room: v.id("rooms"),
    }),
})
