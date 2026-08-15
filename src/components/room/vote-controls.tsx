"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAuthedMutation } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { QuorumMeter } from "../ui/quorum-meter"

/**
 * The room's verdict on the song that's playing.
 *
 * There is one control, not two: a downvote is both "I don't rate this" and "I
 * want it gone". Enough of them and the song ends. Keeping those as separate
 * buttons meant people cast one and forgot the other, and the room's actual
 * opinion ended up split across two tallies that disagreed.
 */
export function VoteControls({
    roomId,
    videoId,
}: {
    roomId: Id<"rooms">
    videoId: string
}) {
    const votes = useQuery(api.voting.getCurrentSongVotes, { roomId })
    const vote = useAuthedMutation(api.voting.voteOnCurrentSong)

    const [pending, setPending] = useState(false)

    async function cast(value: 1 | -1) {
        setPending(true)
        try {
            const result = await vote({ roomId, videoId, value })
            if (result?.skipped) toast.success("The room voted it off")
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Your vote didn't go through",
            )
        } finally {
            setPending(false)
        }
    }

    const canVote = votes?.canVote ?? false
    const myVote = votes?.myVote ?? null
    const dislikes = votes?.dislikes ?? 0
    const required = votes?.required ?? 0

    // One more downvote ends it. Worth saying out loud before someone taps.
    const onTheBrink = required > 0 && dislikes === required - 1

    return (
        <div className="border-ink mt-4 flex flex-col gap-3 border-b-2 pb-5">
            <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                    <VoteButton
                        icon={<ThumbsUpIcon className="size-4" />}
                        count={votes?.likes ?? 0}
                        active={myVote === 1}
                        activeClassName="border-vote-up bg-vote-up text-white"
                        ringClassName="focus-visible:ring-vote-up/40"
                        disabled={!canVote || pending}
                        label={myVote === 1 ? "Take back your vote" : "Vote up"}
                        onClick={() => cast(1)}
                    />
                    <VoteButton
                        icon={<ThumbsDownIcon className="size-4" />}
                        count={dislikes}
                        active={myVote === -1}
                        activeClassName="border-quorum bg-quorum text-ink"
                        ringClassName="focus-visible:ring-quorum/45"
                        disabled={!canVote || pending}
                        label={
                            myVote === -1
                                ? "Take back your vote"
                                : onTheBrink
                                  ? "Vote down, and skip the song"
                                  : "Vote down"
                        }
                        onClick={() => cast(-1)}
                    />
                </div>

                {votes && canVote && (
                    <QuorumMeter
                        votes={dislikes}
                        required={required}
                        tone="light"
                    />
                )}
            </div>

            {votes && !canVote && (
                <p className="text-ink/55 text-xs">
                    You added this song, so the room decides its fate, not you.
                </p>
            )}

            {canVote && (
                <p
                    className={cn(
                        "text-xs transition-colors duration-300 motion-reduce:transition-none",
                        onTheBrink ? "text-amber-800" : "text-ink/55",
                    )}
                >
                    {onTheBrink
                        ? "One more vote down ends this song."
                        : "Voting down also counts towards skipping."}
                </p>
            )}
        </div>
    )
}

function VoteButton({
    icon,
    count,
    active,
    activeClassName,
    ringClassName,
    disabled,
    label,
    onClick,
}: {
    icon: React.ReactNode
    count: number
    active: boolean
    activeClassName: string
    ringClassName: string
    disabled: boolean
    label: string
    onClick: () => void
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={active}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 rounded-none border-2 px-4 py-2 text-sm font-bold transition-colors duration-200 motion-reduce:transition-none",
                "disabled:pointer-events-none disabled:opacity-50",
                "focus-visible:ring-2 focus-visible:outline-none",
                ringClassName,
                active
                    ? activeClassName
                    : "border-ink bg-transparent hover:bg-white/50",
            )}
        >
            {icon}
            <span className="tabular-nums">{count}</span>
        </button>
    )
}
