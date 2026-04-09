import { api } from "@/convex/_generated/api"
import { preloadQuery } from "convex/nextjs"
import { StatsClient } from "./stats-client"

export async function Stats() {
    const preloadedGitHubRepo = await preloadQuery(api.stats.getGithubRepo, {
        name: "motz0815/songup",
    })
    const preloadedRoomStats = await preloadQuery(api.stats.getRoomStats)
    return (
        <StatsClient
            preloadedGitHubRepo={preloadedGitHubRepo}
            preloadedRoomStats={preloadedRoomStats}
        />
    )
}
