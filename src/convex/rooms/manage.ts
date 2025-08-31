import { internalMutation } from "../functions"

// export const createRoom = mutation({
//     args: {
//         maxSongsPerUser: v.number(),
//     },
//     handler: async (ctx, args) => {
//         await ensureAuthOrAnonymous(ctx)

//         const userId = await betterAuthComponent.getAuthUserId(ctx)
//         if (!userId) {
//             throw new Error("User not found")
//         }

//         let code: string
//         // Generate a unique room code
//         do {
//             code = generateRoomCode(4)
//         } while (
//             await ctx.db
//                 .query("rooms")
//                 .withIndex("by_code", (q) => q.eq("code", code))
//                 .unique()
//         )

//         const room = await ctx.db.insert("rooms", {
//             host: userId as Id<"users">,
//             code,
//             expiresAt: Date.now() + 1000 * 60 * 60 * 48, // 48 hours
//             settings: {
//                 maxSongsPerUser: args.maxSongsPerUser,
//             },
//         })
//         return room
//     },
// })

// export const listOwnRooms = query({
//     handler: async (ctx) => {
//         const userId = await betterAuthComponent.getAuthUserId(ctx)
//         if (!userId) {
//             return null
//         }

//         return await ctx.db
//             .query("rooms")
//             .withIndex("by_host", (q) => q.eq("host", userId as Id<"users">))
//             .collect()
//     },
// })

export const cleanExpiredRooms = internalMutation({
    handler: async (ctx) => {
        const expiredRooms = await ctx.db
            .query("rooms")
            .withIndex("by_expires_at", (q) => q.lt("expiresAt", Date.now()))
            .collect()

        for (const room of expiredRooms) {
            await ctx.db.delete(room._id)
        }
    },
})

function generateRoomCode(length: number) {
    let result = ""
    const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789" // Uppercase characters and numbers (minus O and 0 to avoid confusion)
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        )
    }
    return result
}
