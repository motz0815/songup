"use client"

import { HostBackground } from "@/components/host/background"
import { HostPlayer, PlaybackStatus } from "@/components/host/player"
import { RoomQRCode } from "@/components/host/qr-code"
import { HOST_QUEUE_LENGTH, Queue } from "@/components/host/queue"
import { Standings } from "@/components/host/standings"
import { Fullscreen } from "@/components/ui/fullscreen"
import { Progress } from "@/components/ui/progress"
import { QuorumMeter } from "@/components/ui/quorum-meter"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formatDuration } from "@/lib/utils"
import {
    Preloaded,
    useMutation,
    usePreloadedQuery,
    useQuery,
} from "convex/react"
import { SkipForwardIcon } from "lucide-react"
import Link from "next/link"
import { useCallback, useState } from "react"

const SITE_NAME = "democratune.timkolesnichenko.me"

export default function Host({
    roomId,
    preloadedRoom,
}: {
    roomId: Id<"rooms">
    // @ts-ignore
    preloadedRoom: Preloaded<typeof api.rooms.getRoomByCode>
}) {
    /*
     * QUERIES
     */

    const room = usePreloadedQuery(preloadedRoom)

    const currentSong = room?.currentSong ?? null

    const skipStatus = useQuery(api.voting.getSkipStatus, { roomId })

    /*
     * MUTATIONS
     */

    const popSong = useMutation(api.rooms.popSong).withOptimisticUpdate(
        (localStore, args) => {
            // These arguments must match what <Queue> subscribes with, or the
            // lookup misses and the screen waits for the server round trip.
            const queueArgs = {
                roomId: args.roomId,
                numItems: HOST_QUEUE_LENGTH,
            }

            const queue = localStore.getQuery(api.rooms.getQueue, queueArgs)
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
                    queueArgs,
                    queue.slice(1),
                )
            }
        },
    )

    /*
     * OTHER STATE
     */

    const [playback, setPlayback] = useState<PlaybackStatus>({
        progress: 0,
        elapsed: 0,
        duration: 0,
        error: null,
    })

    const advance = useCallback(() => popSong({ roomId }), [popSong, roomId])

    const handleStatusChange = useCallback(
        (status: PlaybackStatus) => setPlayback(status),
        [],
    )

    const isDemocraSchedule = room?.settings?.scheduler === "weighted"

    /*
     * RENDER
     */

    // The player is always mounted so that YouTube keeps a warm iframe between
    // songs; the join panel covers it whenever nothing is playing.
    return (
        <div className="relative min-h-screen w-full p-4 text-white lg:h-screen">
            <HostBackground videoId={currentSong?.videoId} />
            <main className="flex h-full w-full flex-col gap-4">
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="flex w-full flex-col gap-4 lg:col-span-2 lg:row-span-2">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/50 shadow-2xl outline outline-white/20 backdrop-blur-lg">
                            <HostPlayer
                                song={currentSong}
                                onAdvance={advance}
                                onStatusChange={handleStatusChange}
                                className={currentSong ? "" : "invisible"}
                            />
                            {!currentSong && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                    <h2 className="text-4xl font-bold text-balance xl:text-6xl">
                                        {SITE_NAME}
                                    </h2>
                                    <p className="text-2xl xl:text-4xl">
                                        Enter code{" "}
                                        <span className="font-extrabold">
                                            {room?.code}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex w-full flex-col items-center gap-3">
                            <div className="flex w-2/3 items-center gap-3">
                                <Progress
                                    value={playback.progress * 100}
                                    max={100}
                                    className="dark grow"
                                    indicatorClassName="duration-500 ease-linear"
                                />
                                <span className="w-24 shrink-0 text-right text-sm tabular-nums text-white/70">
                                    {formatDuration(playback.elapsed)} /{" "}
                                    {formatDuration(
                                        playback.duration ||
                                            currentSong?.duration ||
                                            0,
                                    )}
                                </span>
                            </div>
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

                            {/* Stays out of the way until the room starts
                                calling for a skip. */}
                            <div className="flex h-9 items-center gap-4">
                                {skipStatus && skipStatus.votes > 0 && (
                                    <QuorumMeter
                                        votes={skipStatus.votes}
                                        required={skipStatus.required}
                                    />
                                )}
                                {currentSong && (
                                    <button
                                        type="button"
                                        onClick={() => void advance()}
                                        className="flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none motion-reduce:transition-none"
                                    >
                                        <SkipForwardIcon className="size-4" />
                                        Skip
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex min-h-0 w-full flex-col gap-4 lg:row-span-2">
                        <Queue roomId={roomId} className="min-h-0 flex-1" />
                        {isDemocraSchedule && <Standings roomId={roomId} />}
                        <div className="flex w-full flex-col items-center gap-2 rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
                            <h3 className="text-center text-2xl font-bold text-shadow-md">
                                Scan to add songs...
                            </h3>
                            <RoomQRCode roomCode={room?.code ?? ""} />
                            <p className="text-center text-lg text-white/80 text-shadow-sm">
                                ...or visit{" "}
                                <span className="font-bold">{SITE_NAME}</span>{" "}
                                and enter code{" "}
                                <span className="font-bold">{room?.code}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <footer className="flex w-full items-center justify-between px-1">
                    <Link href="/host">
                        <h2 className="text-3xl font-bold text-white/80">
                            DemocraTune
                            <span className="text-sm text-white/80">.tv</span>
                        </h2>
                    </Link>
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
