"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useQuery } from "convex/react"

/**
 * Who the room is rewarding, for the big screen.
 *
 * Only shown when DemocraSchedule is running, because it's the only scheduler
 * where a rating changes anything. Ranking listeners under first-come-first-
 * served would be scoreboard theatre.
 */
export function Standings({ roomId }: { roomId: Id<"rooms"> }) {
    const standings = useQuery(api.voting.getRoomRatings, { roomId }) ?? []
    const [animationParent] = useAutoAnimate<HTMLOListElement>()

    return (
        <div className="flex w-full flex-col gap-3 rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
            <h3 className="text-xl font-bold text-shadow-md">Standings</h3>

            {standings.length === 0 ? (
                <p className="text-white/70">
                    Ratings appear here once the room starts voting.
                </p>
            ) : (
                <ol ref={animationParent} className="flex flex-col gap-2">
                    {standings.slice(0, 6).map((entry, index) => (
                        <li
                            key={entry.userId}
                            className="flex items-center gap-3"
                        >
                            <span className="w-5 text-right text-sm text-white/50 tabular-nums">
                                {index + 1}
                            </span>
                            <span className="min-w-0 flex-1 truncate font-medium">
                                {entry.nickname ?? "Anonymous"}
                            </span>
                            <span
                                className={`text-sm font-semibold tabular-nums ${
                                    entry.score > 0
                                        ? "text-emerald-300"
                                        : entry.score < 0
                                          ? "text-rose-300"
                                          : "text-white/60"
                                }`}
                            >
                                {entry.score > 0 ? "+" : ""}
                                {entry.score}
                            </span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    )
}
