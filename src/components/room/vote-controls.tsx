"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAuthedMutation } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { SkipForwardIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { QuorumMeter } from "../ui/quorum-meter"

/**
 * The two ways a listener can influence the room: rate the song that's playing,
 * and call for it to end early.
 *
 * Both act on the current song only, so both disappear together when the room
 * falls silent.
 */
export function VoteControls({
    roomId,
    videoId,
}: {
    roomId: Id<"rooms">
    videoId: string
}) {
    const songVotes = useQuery(api.voting.getCurrentSongVotes, { roomId })
    const skipStatus = useQuery(api.voting.getSkipStatus, { roomId })

    const voteOnSong = useAuthedMutation(api.voting.voteOnCurrentSong)
    const voteToSkip = useAuthedMutation(api.voting.voteToSkip)

    const [pending, setPending] = useState(false)

    async function rate(value: 1 | -1) {
        setPending(true)
        try {
            await voteOnSong({ roomId, videoId, value })
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Your vote didn't go through",
            )
        } finally {
            setPending(false)
        }
    }

    async function skip() {
        setPending(true)
        try {
            const result = await voteToSkip({ roomId, videoId })
            if (result?.skipped) {
                toast.success("The room voted to skip")
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Your vote didn't go through",
            )
        } finally {
            setPending(false)
        }
    }

    const canRate = songVotes?.canVote ?? false
    const myVote = songVotes?.myVote ?? null

    return (
        <div className="flex flex-col gap-4 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md backdrop-blur-lg">
            <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                    <RateButton
                        icon={<ThumbsUpIcon className="size-4" />}
                        count={songVotes?.likes ?? 0}
                        active={myVote === 1}
                        activeClassName="border-emerald-400/60 bg-emerald-400/20 text-emerald-200"
                        disabled={!canRate || pending}
                        label="Rate up"
                        onClick={() => rate(1)}
                    />
                    <RateButton
                        icon={<ThumbsDownIcon className="size-4" />}
                        count={songVotes?.dislikes ?? 0}
                        active={myVote === -1}
                        activeClassName="border-rose-400/60 bg-rose-400/20 text-rose-200"
                        disabled={!canRate || pending}
                        label="Rate down"
                        onClick={() => rate(-1)}
                    />
                </div>

                <button
                    type="button"
                    onClick={skip}
                    disabled={pending || !skipStatus}
                    className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none",
                        "disabled:pointer-events-none disabled:opacity-50",
                        "focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:outline-none",
                        skipStatus?.hasVoted
                            ? "border-amber-300/60 bg-amber-300/20 text-amber-100"
                            : "border-white/20 bg-white/5 hover:bg-white/15",
                    )}
                >
                    <SkipForwardIcon className="size-4" />
                    {skipStatus?.hasVoted ? "Take back vote" : "Vote to skip"}
                </button>
            </div>

            {songVotes && !canRate && (
                <p className="text-xs text-white/60">
                    You added this song, so you can&apos;t rate it.
                </p>
            )}

            {skipStatus && (
                <QuorumMeter
                    votes={skipStatus.votes}
                    required={skipStatus.required}
                />
            )}
        </div>
    )
}

function RateButton({
    icon,
    count,
    active,
    activeClassName,
    disabled,
    label,
    onClick,
}: {
    icon: React.ReactNode
    count: number
    active: boolean
    activeClassName: string
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
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none",
                "disabled:pointer-events-none disabled:opacity-50",
                "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
                active
                    ? activeClassName
                    : "border-white/20 bg-white/5 hover:bg-white/15",
            )}
        >
            {icon}
            <span className="tabular-nums">{count}</span>
        </button>
    )
}
