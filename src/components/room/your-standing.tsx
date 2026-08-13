"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { BASE_WEIGHT } from "@/convex/settings"
import { useQuery } from "convex/react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

/**
 * The listener's own rating, and what it buys them.
 *
 * A raw score means nothing on its own, so the headline is the thing the score
 * actually controls: how often DemocraSchedule comes back around to your queue.
 */
export function YourStanding({ roomId }: { roomId: Id<"rooms"> }) {
    const rating = useQuery(api.voting.getMyRating, { roomId })

    if (!rating) return null

    if (rating.songsCounted === 0) {
        return (
            <div className="rounded-lg border border-white/20 bg-white/10 p-3 text-sm text-white/70 shadow-md">
                Your turns are shared evenly for now. Once your songs start
                playing, the room&apos;s votes decide how often your queue comes
                up.
            </div>
        )
    }

    const share = rating.weight / BASE_WEIGHT
    const rising = rating.score > 0
    const falling = rating.score < 0

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md">
            <div>
                <p className="text-sm text-white/70">Your turn comes up</p>
                <p className="text-2xl font-bold tabular-nums">
                    {share.toFixed(1)}&times;
                    <span className="ml-2 text-sm font-normal text-white/70">
                        as often as an unrated listener
                    </span>
                </p>
            </div>
            <div className="shrink-0 text-right">
                <p
                    className={`flex items-center justify-end gap-1 text-lg font-semibold tabular-nums ${
                        rising
                            ? "text-emerald-300"
                            : falling
                              ? "text-rose-300"
                              : "text-white/80"
                    }`}
                >
                    {rising && <TrendingUpIcon className="size-4" />}
                    {falling && <TrendingDownIcon className="size-4" />}
                    {rating.score > 0 ? "+" : ""}
                    {rating.score}
                </p>
                <p className="text-xs text-white/60 tabular-nums">
                    over {rating.songsCounted}{" "}
                    {rating.songsCounted === 1 ? "song" : "songs"}
                </p>
            </div>
        </div>
    )
}
