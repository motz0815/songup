"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
    beginAuthorization,
    currentToken,
    exportPlaylist,
    spotifyConfigured,
    type ExportResult,
    type ResolvableTrack,
} from "@/lib/spotify"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { CheckIcon, LoaderIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

/**
 * Takes the night home with you.
 *
 * Everything here runs in this browser: the Spotify token is obtained by this
 * page, held in this tab, and never sent to DemocraTune. The server's only
 * involvement is telling us what was played.
 */
export function ExportPlaylist({
    roomId,
    roomCode,
}: {
    roomId: Id<"rooms">
    roomCode: string
}) {
    const tracks = useQuery(api.exports.getRoomExport, { roomId })

    const [progress, setProgress] = useState<{
        resolved: number
        total: number
    } | null>(null)
    const [result, setResult] = useState<ExportResult | null>(null)

    if (!spotifyConfigured()) return null

    const count = tracks?.length ?? 0
    const running = progress !== null

    async function send() {
        if (!tracks || tracks.length === 0) return

        const token = currentToken()
        if (!token) {
            // Comes straight back here, then the guest presses the button
            // again. Auto-resuming would mean exporting on page load, which is
            // a surprising thing to have happen to your account.
            await beginAuthorization(window.location.pathname)
            return
        }

        setResult(null)
        setProgress({ resolved: 0, total: tracks.length })

        try {
            const payload: ResolvableTrack[] = tracks.map((track) => ({
                key: track.key,
                title: track.title,
                artist: track.artist,
                duration: track.duration,
                spotifyId: track.spotifyId,
            }))

            const outcome = await exportPlaylist(
                token,
                `DemocraTune ${roomCode}`,
                `Everything room ${roomCode} played, in order.`,
                payload,
                setProgress,
            )

            setResult(outcome)
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "The export didn't finish.",
            )
        } finally {
            setProgress(null)
        }
    }

    return (
        <div className="border-ink mt-4 flex flex-col gap-3 border-y-2 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="font-medium">Save this night to Spotify</p>
                    <p className="text-ink/55 text-xs">
                        {count === 0
                            ? "Nothing has played yet."
                            : `${count} song${count === 1 ? "" : "s"} · goes to a private playlist`}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={send}
                    disabled={count === 0 || running}
                    className={cn(
                        "border-ink bg-vote-up flex items-center gap-2 rounded-none border-2 px-4 py-2 text-sm font-bold text-white",
                        "hover:bg-vote-up/90 transition-colors duration-200 motion-reduce:transition-none",
                        "disabled:pointer-events-none disabled:opacity-50",
                        "focus-visible:ring-broadcast/35 focus-visible:ring-4 focus-visible:outline-none",
                    )}
                >
                    {running && (
                        <LoaderIcon className="size-4 animate-spin motion-reduce:animate-none" />
                    )}
                    {running ? "Sending…" : "Send to Spotify"}
                </button>
            </div>

            {progress && (
                <p
                    className="text-ink/60 text-xs tabular-nums"
                    role="status"
                    aria-live="polite"
                >
                    Matching songs — {progress.resolved} of {progress.total}
                </p>
            )}

            {result && (
                <div className="border-ink/20 flex flex-col gap-1 border-t pt-3 text-sm">
                    <p className="text-vote-up flex items-center gap-2">
                        <CheckIcon className="size-4" />
                        <a
                            href={result.playlistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 hover:opacity-70"
                        >
                            {result.added} song
                            {result.added === 1 ? "" : "s"} added — open the
                            playlist
                        </a>
                    </p>
                    {result.missed.length > 0 && (
                        <details className="text-ink/55 text-xs">
                            <summary className="hover:text-ink/80 cursor-pointer">
                                {result.missed.length} couldn&apos;t be found on
                                Spotify
                            </summary>
                            <ul className="mt-1 space-y-0.5 pl-4">
                                {result.missed.map((track) => (
                                    <li key={track.key}>
                                        {track.artist} — {track.title}
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}
                </div>
            )}
        </div>
    )
}
