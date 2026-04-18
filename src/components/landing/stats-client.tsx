"use client"

import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"

export function StatsClient({
    preloadedGitHubRepo,
    preloadedRoomStats,
}: {
    preloadedGitHubRepo: Preloaded<typeof api.stats.getGithubRepo>
    preloadedRoomStats: Preloaded<typeof api.stats.getRoomStats>
}) {
    const githubRepo = usePreloadedQuery(preloadedGitHubRepo)
    const roomStats = usePreloadedQuery(preloadedRoomStats)

    return (
        <div className="mb-16 grid grid-cols-1 divide-y divide-white/10 rounded-xl border border-white/20 bg-white/5 backdrop-blur-lg sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
                {
                    value: githubRepo?.starCount ?? 0,
                    label: "GitHub Stars",
                    href: "https://github.com/motz0815/songup",
                },
                {
                    value: roomStats?.roomsCreated ?? 0,
                    label: "Rooms Created",
                },
                {
                    value: roomStats?.songsAdded ?? 0,
                    label: "Songs Added",
                },
            ].map((stat) => {
                const content = (
                    <div className="flex flex-col items-center gap-1 px-6 py-8">
                        <span className="text-4xl font-bold tracking-tight">
                            {stat.value}
                        </span>
                        <span className="text-sm text-white/60">
                            {stat.label}
                        </span>
                    </div>
                )

                return stat.href ? (
                    <a
                        href={stat.href}
                        key={stat.label}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {content}
                    </a>
                ) : (
                    <div key={stat.label}>{content}</div>
                )
            })}
        </div>
    )
}
