import { OssStats } from "@erquhart/convex-oss-stats"
import { components, internal } from "./_generated/api"
import { internalAction, internalMutation, query } from "./_generated/server"

export const ossStats = new OssStats(components.ossStats, {
    githubRepos: ["motz0815/songup"],
    githubOwners: ["motz0815"],
    githubAccessToken: process.env.GITHUB_ACCESS_TOKEN!,
    githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET!,
})

export const { sync, getGithubRepo, getGithubOwner } = ossStats.api()

export const updateStats = internalAction({
    handler: async (ctx) => {
        const headers = {
            Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY!}`,
            "Content-Type": "application/json",
        }

        const stats = await fetch(
            "https://eu.posthog.com/api/environments/46839/endpoints/total-rooms/run",
            { headers },
        )
        const data = await stats.json()
        if (data.results[0]) {
            await ctx.runMutation(internal.stats.insert, {
                roomsCreated: data.results[0][0],
                songsAdded: data.results[0][1],
            })
        }
    },
})

export const insert = internalMutation({
    handler: async (
        ctx,
        data: { roomsCreated: number; songsAdded: number },
    ) => {
        const stats = await ctx.db.query("stats").first()
        if (!stats) {
            await ctx.db.insert("stats", {
                roomsCreated: 0,
                songsAdded: 0,
            })
            return
        }
        await ctx.db.patch("stats", stats._id, {
            roomsCreated: data.roomsCreated,
            songsAdded: data.songsAdded,
        })
    },
})

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
