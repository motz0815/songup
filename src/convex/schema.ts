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
    }).index("email", ["email"]),
    rooms: defineTable({
        host: v.id("users"),
        proStatus: v.union(
            v.literal("free"),
            v.literal("pending"),
            v.literal("active"),
        ),
        code: v.string(),
        expiresAt: v.number(),
        currentSong: v.optional(v.object(song)),
        settings: v.object({
            maxSongsPerUser: v.number(),
        }),
    })
        .index("by_code", ["code"])
        .index("by_host", ["host"])
        .index("by_expires_at", ["expiresAt"]),
    queuedSongs: defineTable({
        room: v.id("rooms"),
        order: v.number(),
        ...song,
    })
        .index("by_room_order_type", ["room", "order", "type"])
        .index("by_added_by_room", ["addedBy", "room"]),
})
