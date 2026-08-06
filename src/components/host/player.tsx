"use client"

import { cn } from "@/lib/utils"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import YouTube, { YouTubeProps } from "react-youtube"

/** YouTube IFrame API player states. */
const PlayerState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
} as const

/**
 * YouTube error codes.
 *  2   - malformed video id
 *  5   - HTML5 player failed to load the video
 *  100 - video removed or private
 *  101 - owner disallowed embedded playback
 *  150 - same as 101
 *
 * 5 is the only one worth retrying; the rest mean the video will never play
 * inside an embed, so the song has to be skipped.
 */
const RETRYABLE_ERROR_CODES = new Set([5])

/** Never pop the queue faster than this, so a run of bad songs can't drain it. */
const MIN_ADVANCE_INTERVAL_MS = 1500
/** Nudge the player if it hasn't started this long after we asked it to play. */
const NUDGE_AFTER_MS = 6000
/** Give up on a song that never starts playing. */
const STALL_TIMEOUT_MS = 20000
/** Stop auto-skipping after this many songs fail back-to-back. */
const MAX_CONSECUTIVE_FAILURES = 4

export type PlayerSong = {
    videoId: string
    title: string
    artist: string
    duration: number
}

export type PlaybackStatus = {
    /** 0..1 fraction of the current song that has elapsed. */
    progress: number
    /** Seconds elapsed in the current song. */
    elapsed: number
    /** Song duration in seconds, as reported by the player. */
    duration: number
    /** Set when auto-skip has been disabled after repeated failures. */
    error: string | null
}

/**
 * Plays the room's current song and advances the queue when it finishes.
 *
 * The `<YouTube>` element is mounted exactly once with a constant `videoId`.
 * react-youtube destroys and recreates the whole player whenever the `videoId`
 * prop changes, which causes a visible flash and drops autoplay permission, so
 * song changes are driven through `loadVideoById` instead.
 */
export function HostPlayer({
    song,
    onAdvance,
    onStatusChange,
    className,
}: {
    song: PlayerSong | null
    /** Called when the current song is over, unplayable, or stalled. */
    onAdvance: () => Promise<unknown>
    onStatusChange?: (status: PlaybackStatus) => void
    className?: string
}) {
    const playerRef = useRef<YouTube>(null)

    const [status, setStatus] = useState<PlaybackStatus>({
        progress: 0,
        elapsed: 0,
        duration: 0,
        error: null,
    })

    const videoId = song?.videoId ?? null

    /*
     * ADVANCING
     *
     * onEnd and onError can both fire for the same song, and the stall
     * watchdog can fire on top of them. Requests are coalesced into a single
     * pending advance and rate limited so a queue of unplayable songs drains
     * slowly enough to be visible rather than instantly.
     */

    const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const advanceInFlightRef = useRef(false)
    const lastAdvanceAtRef = useRef(0)
    const consecutiveFailuresRef = useRef(0)
    const onAdvanceRef = useRef(onAdvance)
    onAdvanceRef.current = onAdvance

    const requestAdvance = useCallback((reason: string) => {
        if (advanceInFlightRef.current || advanceTimerRef.current) return

        const wait = Math.max(
            0,
            MIN_ADVANCE_INTERVAL_MS - (Date.now() - lastAdvanceAtRef.current),
        )

        advanceTimerRef.current = setTimeout(async () => {
            advanceTimerRef.current = null
            advanceInFlightRef.current = true
            lastAdvanceAtRef.current = Date.now()
            try {
                await onAdvanceRef.current()
            } catch (error) {
                console.error(`Failed to advance queue (${reason})`, error)
            } finally {
                advanceInFlightRef.current = false
            }
        }, wait)
    }, [])

    useEffect(() => {
        return () => {
            if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
        }
    }, [])

    /*
     * LOADING THE CURRENT SONG
     */

    const playerReadyRef = useRef(false)
    const loadedVideoIdRef = useRef<string | null>(null)
    const startedAtRef = useRef(0)
    const hasPlayedRef = useRef(false)
    const nudgedRef = useRef(false)
    const retriedRef = useRef(false)

    const loadCurrentSong = useCallback(async () => {
        const player = playerRef.current?.getInternalPlayer()
        if (!player || !playerReadyRef.current) return
        if (loadedVideoIdRef.current === videoId) return

        loadedVideoIdRef.current = videoId
        startedAtRef.current = Date.now()
        hasPlayedRef.current = false
        nudgedRef.current = false
        retriedRef.current = false
        setStatus((prev) => ({ ...prev, progress: 0, elapsed: 0, duration: 0 }))

        try {
            if (videoId) {
                await player.loadVideoById(videoId)
            } else {
                await player.stopVideo()
            }
        } catch (error) {
            console.error("Failed to load video", error)
        }
    }, [videoId])

    useEffect(() => {
        void loadCurrentSong()
    }, [loadCurrentSong])

    /*
     * FAILURE HANDLING
     */

    const registerFailure = useCallback(() => {
        consecutiveFailuresRef.current += 1
        if (consecutiveFailuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
            setStatus((prev) => ({
                ...prev,
                error: "Several songs in a row could not be played. Auto-skip is paused.",
            }))
        }
    }, [])

    // The circuit breaker: once tripped, stop draining the queue automatically.
    const autoSkipEnabled = status.error === null

    /*
     * PROGRESS + STALL WATCHDOG
     */

    useEffect(() => {
        if (!videoId) return

        const intervalId = setInterval(async () => {
            const player = playerRef.current?.getInternalPlayer()
            if (!player) return

            try {
                const [duration, elapsed] = await Promise.all([
                    player.getDuration(),
                    player.getCurrentTime(),
                ])

                if (typeof duration === "number" && duration > 0) {
                    setStatus((prev) => ({
                        ...prev,
                        duration,
                        elapsed: elapsed ?? 0,
                        progress: Math.min(1, (elapsed ?? 0) / duration),
                    }))
                }
            } catch (error) {
                console.error("Failed to read playback progress", error)
                return
            }

            // Watchdog: YouTube sometimes leaves the player sitting in
            // UNSTARTED/BUFFERING forever instead of raising an error.
            if (hasPlayedRef.current) return
            const waiting = Date.now() - startedAtRef.current

            if (waiting > STALL_TIMEOUT_MS) {
                registerFailure()
                if (autoSkipEnabled) requestAdvance("stalled")
            } else if (waiting > NUDGE_AFTER_MS && !nudgedRef.current) {
                nudgedRef.current = true
                player.playVideo().catch(() => {})
            }
        }, 500)

        return () => clearInterval(intervalId)
    }, [videoId, requestAdvance, registerFailure, autoSkipEnabled])

    const handleStateChange: YouTubeProps["onStateChange"] = useCallback(
        (event: { data: number }) => {
            if (event.data === PlayerState.PLAYING) {
                hasPlayedRef.current = true
                consecutiveFailuresRef.current = 0
                retriedRef.current = false
            }
        },
        [],
    )

    const handleError: YouTubeProps["onError"] = useCallback(
        async (event: { data: number }) => {
            const player = playerRef.current?.getInternalPlayer()

            // A transient HTML5 failure is worth one reload before giving up.
            if (
                RETRYABLE_ERROR_CODES.has(event.data) &&
                !retriedRef.current &&
                videoId &&
                player
            ) {
                retriedRef.current = true
                startedAtRef.current = Date.now()
                nudgedRef.current = false
                try {
                    await player.loadVideoById(videoId)
                    return
                } catch (error) {
                    console.error("Retry after player error failed", error)
                }
            }

            console.warn(
                `YouTube error ${event.data} for video ${videoId} - skipping`,
            )
            registerFailure()
            if (autoSkipEnabled) requestAdvance(`error ${event.data}`)
        },
        [videoId, registerFailure, requestAdvance, autoSkipEnabled],
    )

    const handleEnd: YouTubeProps["onEnd"] = useCallback(() => {
        consecutiveFailuresRef.current = 0
        requestAdvance("ended")
    }, [requestAdvance])

    const handleReady: YouTubeProps["onReady"] = useCallback(() => {
        playerReadyRef.current = true
        void loadCurrentSong()
    }, [loadCurrentSong])

    /*
     * OPTIONS
     *
     * Must be referentially stable in content: react-youtube deep-compares
     * `opts` and tears the player down when it differs.
     */

    const opts: YouTubeProps["opts"] = useMemo(
        () => ({
            width: "100%",
            height: "100%",
            playerVars: {
                autoplay: 1,
                // Required for the IFrame API to accept our postMessage calls.
                // With this off, onEnd never fires and the queue never advances.
                enablejsapi: 1,
                disablekb: 1,
                fs: 0,
                rel: 0,
                modestbranding: 1,
                controls: 1,
                playsinline: 1,
                origin:
                    typeof window === "undefined"
                        ? undefined
                        : window.location.origin,
            },
            host: "https://www.youtube-nocookie.com",
        }),
        [],
    )

    /*
     * STATUS REPORTING
     */

    const onStatusChangeRef = useRef(onStatusChange)
    onStatusChangeRef.current = onStatusChange

    useEffect(() => {
        onStatusChangeRef.current?.(status)
    }, [status])

    const retry = useCallback(async () => {
        consecutiveFailuresRef.current = 0
        setStatus((prev) => ({ ...prev, error: null }))
        loadedVideoIdRef.current = null
        await loadCurrentSong()
    }, [loadCurrentSong])

    return (
        <div className={cn("relative h-full w-full", className)}>
            <YouTube
                ref={playerRef}
                className="h-full w-full"
                iframeClassName="h-full w-full"
                // Deliberately constant. Changing this prop makes react-youtube
                // destroy and rebuild the player on every song.
                videoId=""
                opts={opts}
                onReady={handleReady}
                onStateChange={handleStateChange}
                onEnd={handleEnd}
                onError={handleError}
            />
            {status.error && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/80 p-6 text-center backdrop-blur-sm">
                    <p className="text-xl font-semibold">{status.error}</p>
                    <button
                        onClick={retry}
                        className="rounded-lg bg-white/20 px-4 py-2 font-medium transition-colors hover:bg-white/30"
                    >
                        Try again
                    </button>
                </div>
            )}
        </div>
    )
}
