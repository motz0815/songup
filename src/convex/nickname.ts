// export const setNickname = mutation({
//     args: {
//         nickname: v.string(),
//     },
//     handler: async (ctx, args) => {
//         await ensureAuthOrAnonymous(ctx)

//         const userId = await betterAuthComponent.getAuthUserId(ctx)

//         // Update the user's nickname
//         await ctx.db.patch(userId as Id<"users">, {
//             nickname: args.nickname,
//         })
//     },
// })

// export const getNickname = query({
//     handler: async (ctx) => {
//         const userId = await betterAuthComponent.getAuthUserId(ctx)
//         if (!userId) return null
//         const user = await ctx.db.get(userId as Id<"users">)
//         return user?.nickname
//     },
// })
