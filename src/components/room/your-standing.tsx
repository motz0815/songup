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
            <div className="border-ink text-ink/65 mt-3 border-y-2 py-4 text-sm">
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
        <div className="border-ink mt-3 flex items-center justify-between gap-3 border-y-2 py-4">
            <div>
                <p className="text-ink/60 text-sm">Your turn comes up</p>
                <p className="font-display text-3xl font-extrabold tracking-[-0.04em] tabular-nums">
                    {share.toFixed(1)}&times;
                    <span className="text-ink/60 ml-2 text-sm font-normal">
                        as often as an unrated listener
                    </span>
                </p>
            </div>
            <div className="shrink-0 text-right">
                <p
                    className={`flex items-center justify-end gap-1 text-lg font-semibold tabular-nums ${
                        rising
                            ? "text-vote-up"
                            : falling
                              ? "text-destructive"
                              : "text-ink/70"
                    }`}
                >
                    {rising && <TrendingUpIcon className="size-4" />}
                    {falling && <TrendingDownIcon className="size-4" />}
                    {rating.score > 0 ? "+" : ""}
                    {rating.score}
                </p>
                <p className="text-ink/50 text-xs tabular-nums">
                    over {rating.songsCounted}{" "}
                    {rating.songsCounted === 1 ? "song" : "songs"}
                </p>
            </div>
        </div>
    )
}
