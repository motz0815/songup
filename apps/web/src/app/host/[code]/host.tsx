"use client"

import { HostBackground } from "@/components/host/background"
import { RoomQRCode } from "@/components/host/qr-code"
import { Queue } from "@/components/host/queue"
import { UpgradeRoom } from "@/components/host/upgrade-room"
import { api } from "@songup/backend/convex/_generated/api"
import type { Id } from "@songup/backend/convex/_generated/dataModel"
import { Button } from "@songup/ui/components/button"
import { Fullscreen } from "@songup/ui/components/fullscreen"
import { Progress } from "@songup/ui/components/progress"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import { PlayIcon, RotateCwIcon } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import { useEffect, useRef, useState } from "react"
import YouTube, { YouTubeProps } from "react-youtube"
import { toast } from "sonner"

// If a song isn't playing after this long, the browser likely blocked autoplay.
const START_TIMEOUT_MS = 8_000
// If the embed still isn't ready after this long, it will not load.
const LOAD_TIMEOUT_MS = 20_000

type PlaybackBlockedReason = "autoplay" | "player_not_loaded"

const blockedPrompt = {
    autoplay: {
        message: "Your browser paused the music",
        icon: <PlayIcon />,
        label: "Tap to play",
    },
    player_not_loaded: {
        message: "The player didn't load",
        icon: <RotateCwIcon />,
        label: "Reload",
    },
} satisfies Record<PlaybackBlockedReason, object>

export default function Host({
    roomId,
    preloadedRoom,
}: {
    roomId: Id<"rooms">
    preloadedRoom: Preloaded<typeof api.rooms.getRoomByCode>
}) {
    /*
     * QUERIES
     */

    const room = usePreloadedQuery(preloadedRoom)

    const currentSong = room?.currentSong

    /*
     * MUTATIONS
     */

    const popSong = useMutation(api.rooms.popSong).withOptimisticUpdate(
        (localStore, args) => {
            const queue = localStore.getQuery(api.rooms.getQueue, {
                roomId: args.roomId,
            })
            const nextSong = queue?.[0]
            if (nextSong && room) {
                // Set the next song as the current song
                localStore.setQuery(
                    api.rooms.getRoomByCode,
                    {
                        code: room.code,
                    },
                    {
                        ...room,
                        currentSong: nextSong,
                    },
                )

                // Remove the next song from the queue
                localStore.setQuery(
                    api.rooms.getQueue,
                    { roomId: args.roomId },
                    queue.slice(1),
                )
            }
        },
    )

    /*
     * OTHER STATE
     */

    const playerRef = useRef<YouTube>(null)

    const [progress, setProgress] = useState(0)

    // Retry once per playback, and ignore repeated errors while skipping.
    const retriedVideoId = useRef<string | null>(null)
    const skippingSong = useRef(false)

    // react-youtube rebuilds the player for each song, so these reset per song.
    const playerReady = useRef(false)
    const playerPlaying = useRef(false)
    const reportedBlock = useRef(false)
    // Stop skipping after one song whose embed never loaded, so a broken
    // connection doesn't drain the whole queue.
    const lastLoadFailed = useRef(false)
    const [blocked, setBlocked] = useState<{
        videoId: string
        reason: PlaybackBlockedReason
    } | null>(null)

    // Watchdog: YouTube fires no event when autoplay is blocked or the embed
    // never loads, so check that each song actually starts.
    useEffect(() => {
        retriedVideoId.current = null
        skippingSong.current = false
        playerReady.current = false
        playerPlaying.current = false
        reportedBlock.current = false

        const videoId = currentSong?.videoId
        if (!videoId) return

        const check = (final: boolean) => {
            if (playerPlaying.current || skippingSong.current) return
            if (playerReady.current) {
                showBlocked(videoId, "autoplay")
            } else if (final) {
                onPlayerStalled(videoId)
            }
        }

        const startTimer = setTimeout(() => check(false), START_TIMEOUT_MS)
        const loadTimer = setTimeout(() => check(true), LOAD_TIMEOUT_MS)
        return () => {
            clearTimeout(startTimer)
            clearTimeout(loadTimer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong?.videoId])

    /*
     * EFFECTS
     */

    // track the current song progress
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!currentSong) setProgress(0)
            if (playerRef.current) {
                const duration = await playerRef.current
                    .getInternalPlayer()
                    ?.getDuration()
                const currentTime = await playerRef.current
                    .getInternalPlayer()
                    ?.getCurrentTime()
                if (duration && currentTime) {
                    setProgress(currentTime / duration)
                }
            }
        }, 1000)

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId)
    }, [currentSong])

    /*
     * OPTIONS
     */

    const opts: YouTubeProps["opts"] = {
        width: "100%",
        height: "100%",
        playerVars: {
            autoplay: 1,
            // Disable cookies and tracking
            enablejsapi: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            controls: 1,
        },
        host: "https://www.youtube-nocookie.com",
    }

    const onPlayerReady: YouTubeProps["onReady"] = () => {
        playerReady.current = true
        lastLoadFailed.current = false
    }

    const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
        if (event.data === -1) {
            event.target.playVideo()
        }
    }

    const onPlayerPlay: YouTubeProps["onPlay"] = () => {
        playerPlaying.current = true
        setBlocked(null)
    }

    function showBlocked(videoId: string, reason: PlaybackBlockedReason) {
        if (reportedBlock.current) return
        reportedBlock.current = true
        setBlocked({ videoId, reason })
        posthog.capture("song_playback_blocked", { roomId, reason, videoId })
    }

    function onTapToPlay() {
        playerRef.current?.getInternalPlayer()?.playVideo()
        // Hide the overlay either way. If the browser still blocks the call,
        // the host can tap the player's own play button.
        setBlocked(null)
    }

    function onPlayerStalled(videoId: string) {
        if (lastLoadFailed.current) {
            showBlocked(videoId, "player_not_loaded")
            return
        }
        lastLoadFailed.current = true
        skipSong("stalled", "didn't load in time.")
    }

    function capturePopped(reason: "ended" | "error" | "stalled") {
        if (!currentSong) return
        posthog.capture("song_popped", {
            roomId,
            reason,
            videoId: currentSong.videoId,
            title: currentSong.title,
            artist: currentSong.artist,
        })
    }

    const onPlayerEnd: YouTubeProps["onEnd"] = () => {
        capturePopped("ended")
        popSong({ roomId })
    }

    const onPlayerError: YouTubeProps["onError"] = (event) => {
        if (!currentSong || skippingSong.current) return

        // The YouTube API script failed to load. No player exists, and every
        // song after this one will fail too, so ask the host to reload.
        if (!event?.target) {
            lastLoadFailed.current = true
            showBlocked(currentSong.videoId, "player_not_loaded")
            return
        }

        // Retry the song once before giving up. Some embed errors are transient.
        if (retriedVideoId.current !== currentSong.videoId) {
            retriedVideoId.current = currentSong.videoId
            event.target.loadVideoById(currentSong.videoId)
            return
        }

        // Second failure: skip the song, tell the room why, and record it.
        skipSong("error", "can't be played here.")
    }

    function skipSong(reason: "error" | "stalled", problem: string) {
        if (!currentSong) return
        skippingSong.current = true
        toast.error("Skipped a song", {
            description: `${currentSong.artist} - ${currentSong.title} ${problem}`,
        })
        capturePopped(reason)
        void popSong({ roomId }).catch(() => {
            skippingSong.current = false
            toast.error("Couldn't skip song", {
                description: "Please try again.",
            })
        })
    }

    return (
        <div className="relative min-h-screen w-full p-4 text-white lg:h-screen">
            <HostBackground videoId={currentSong?.videoId} />
            <main className="flex h-full w-full flex-col gap-4">
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="flex w-full flex-col gap-4 lg:col-span-2 lg:row-span-2">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/50 shadow-2xl outline outline-white/20 backdrop-blur-lg">
                            {currentSong && (
                                <YouTube
                                    ref={playerRef}
                                    className="z-10 aspect-video w-full"
                                    videoId={currentSong.videoId ?? ""}
                                    opts={opts}
                                    onReady={onPlayerReady}
                                    onStateChange={onPlayerStateChange}
                                    onPlay={onPlayerPlay}
                                    onEnd={onPlayerEnd}
                                    onError={onPlayerError}
                                />
                            )}
                            {blocked &&
                                blocked.videoId === currentSong?.videoId && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/70 p-4 text-center">
                                        <p className="text-xl font-bold md:text-3xl">
                                            {
                                                blockedPrompt[blocked.reason]
                                                    .message
                                            }
                                        </p>
                                        <Button
                                            size="lg"
                                            onClick={
                                                blocked.reason === "autoplay"
                                                    ? onTapToPlay
                                                    : () =>
                                                          window.location.reload()
                                            }
                                        >
                                            {blockedPrompt[blocked.reason].icon}
                                            {
                                                blockedPrompt[blocked.reason]
                                                    .label
                                            }
                                        </Button>
                                    </div>
                                )}
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                                <h2 className="text-6xl font-bold">
                                    songup.tv
                                </h2>
                                <p className="text-4xl">
                                    Enter code{" "}
                                    <span className="font-extrabold">
                                        {room?.code}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-3">
                            <Progress
                                value={progress * 100}
                                max={100}
                                className="dark w-2/3"
                                indicatorClassName="duration-1000 ease-linear"
                            />
                            <div>
                                <h2 className="text-center text-3xl font-bold text-shadow-md">
                                    {currentSong
                                        ? currentSong.artist +
                                          " - " +
                                          currentSong.title
                                        : "No song playing"}
                                </h2>
                                {currentSong?.addedByNickname && (
                                    <p className="text-center text-lg text-white/80 text-shadow-sm">
                                        by {currentSong.addedByNickname}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <Queue roomId={roomId} />
                    <div className="flex w-full flex-col items-center gap-2 rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
                        <h3 className="text-center text-2xl font-bold text-shadow-md">
                            Scan to add songs...
                        </h3>
                        <RoomQRCode roomCode={room?.code ?? ""} />
                        <p className="text-center text-lg text-white/80 text-shadow-sm">
                            ...or visit{" "}
                            <span className="font-bold">songup.tv</span> and
                            enter code{" "}
                            <span className="font-bold">{room?.code}</span>
                        </p>
                    </div>
                </div>
                <footer className="flex w-full items-center justify-between px-1">
                    <div className="flex items-baseline gap-2">
                        <Link href="/host">
                            <h2 className="text-3xl font-bold text-white/80">
                                SongUp
                                <span className="text-sm text-white/80">
                                    .tv
                                </span>
                                {room?.proStatus === "active" && (
                                    <span className="ml-2 text-shadow-md">
                                        Pro
                                    </span>
                                )}
                            </h2>
                        </Link>
                        {room?.proStatus === "free" && (
                            <UpgradeRoom roomId={roomId}>
                                <span className="flex cursor-pointer items-baseline gap-2 text-xl font-bold text-white/80 hover:underline">
                                    Free
                                </span>
                            </UpgradeRoom>
                        )}
                    </div>
                    <p className="text-3xl font-bold text-white/80">
                        {room?.code}
                    </p>
                </footer>
            </main>
            {/* This is a hidden component that enables toggling fullscreen by hitting F */}
            <Fullscreen />
        </div>
    )
}
