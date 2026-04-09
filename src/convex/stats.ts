import { OssStats } from "@erquhart/convex-oss-stats"
import { components } from "./_generated/api"
import { MutationCtx, query } from "./_generated/server"

export const ossStats = new OssStats(components.ossStats, {
    githubRepos: ["motz0815/songup"],
    githubOwners: ["motz0815"],
    githubAccessToken: process.env.GITHUB_ACCESS_TOKEN!,
    githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET!,
})

export const { sync, getGithubRepo, getGithubOwner } = ossStats.api()

export const getRoomStats = query({
    handler: async (ctx) => {
        const stats = await ctx.db.query("stats").first()
        if (!stats) {
            return {
                roomsCreated: 0,
                songsAdded: 0,
            }
        }
        return stats
    },
})

export async function countRoomCreated(ctx: MutationCtx) {
    const stats = await ctx.db.query("stats").first()
    if (!stats) {
        await ctx.db.insert("stats", {
            roomsCreated: 1,
            songsAdded: 0,
        })
        return
    }
    await ctx.db.patch("stats", stats._id, {
        roomsCreated: stats.roomsCreated + 1,
    })
    return stats.roomsCreated + 1
}

export async function countSongAdded(ctx: MutationCtx) {
    const stats = await ctx.db.query("stats").first()
    if (!stats) {
        await ctx.db.insert("stats", {
            roomsCreated: 0,
            songsAdded: 1,
        })
        return
    }
    await ctx.db.patch("stats", stats._id, {
        songsAdded: stats.songsAdded + 1,
    })
    return stats.songsAdded + 1
}
