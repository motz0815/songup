"use client"

import { BrandMark } from "@/components/brand/brand-mark"
import { RoomCode } from "@/components/brand/room-code"
import { TallyField } from "@/components/brand/tally-field"
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
import { cn, formatDuration } from "@/lib/utils"
import {
    Preloaded,
    useMutation,
    usePreloadedQuery,
    useQuery,
} from "convex/react"
import { SkipForwardIcon, ThumbsUpIcon } from "lucide-react"
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
    const room = usePreloadedQuery(preloadedRoom)
    const currentSong = room?.currentSong ?? null
    const votes = useQuery(api.voting.getCurrentSongVotes, { roomId })

    const popSong = useMutation(api.rooms.popSong).withOptimisticUpdate(
        (localStore, args) => {
            const queueArgs = {
                roomId: args.roomId,
                numItems: HOST_QUEUE_LENGTH,
            }
            const queue = localStore.getQuery(api.rooms.getQueue, queueArgs)
            const nextSong = queue?.[0]

            if (nextSong && room) {
                localStore.setQuery(
                    api.rooms.getRoomByCode,
                    { code: room.code },
                    { ...room, currentSong: nextSong },
                )
                localStore.setQuery(
                    api.rooms.getQueue,
                    queueArgs,
                    queue.slice(1),
                )
            }
        },
    )

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

    return (
        <div className="bg-night relative min-h-screen overflow-hidden p-4 text-white lg:h-screen lg:p-5">
            <HostBackground videoId={currentSong?.videoId} />

            <main className="relative z-10 h-full">
                <div
                    className={cn(
                        "grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(22rem,0.78fr)]",
                        !currentSong && "invisible",
                    )}
                >
                    <section className="flex min-h-0 flex-col">
                        <div className="relative aspect-video w-full overflow-hidden border-2 border-white/35 bg-black shadow-2xl">
                            <HostPlayer
                                song={currentSong}
                                onAdvance={advance}
                                onStatusChange={handleStatusChange}
                            />
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col justify-center py-5">
                            <div className="flex items-center gap-4">
                                <Progress
                                    value={playback.progress * 100}
                                    max={100}
                                    className="dark h-2 grow rounded-none bg-white/15"
                                    indicatorClassName="duration-500 ease-linear bg-signal rounded-none"
                                />
                                <span className="font-code w-32 shrink-0 text-right text-sm text-white/65 tabular-nums">
                                    {formatDuration(playback.elapsed)} /{" "}
                                    {formatDuration(
                                        playback.duration ||
                                            currentSong?.duration ||
                                            0,
                                    )}
                                </span>
                            </div>

                            <div className="mt-5 grid gap-4 border-t border-white/25 pt-4 xl:grid-cols-[1fr_auto] xl:items-end">
                                <div>
                                    <p className="font-code text-signal text-xs font-bold tracking-[0.18em] uppercase">
                                        Now broadcasting
                                    </p>
                                    <h1 className="font-display mt-2 line-clamp-2 text-4xl leading-[0.92] font-extrabold tracking-[-0.055em] text-balance xl:text-6xl">
                                        {currentSong?.title}
                                    </h1>
                                    <p className="mt-2 text-lg text-white/65 xl:text-xl">
                                        {currentSong?.artist}
                                        {currentSong?.addedByNickname && (
                                            <span className="text-white/40">
                                                {" "}
                                                · added by{" "}
                                                {currentSong.addedByNickname}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="flex min-h-10 flex-wrap items-center gap-4 xl:justify-end">
                                    {votes && votes.likes > 0 && (
                                        <span className="text-vote-up flex items-center gap-1.5 text-sm font-bold">
                                            <ThumbsUpIcon className="size-4" />
                                            <span className="tabular-nums">
                                                {votes.likes}
                                            </span>
                                        </span>
                                    )}
                                    {votes && votes.dislikes > 0 && (
                                        <QuorumMeter
                                            votes={votes.dislikes}
                                            required={votes.required}
                                            size="compact"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => void advance()}
                                        className="hover:text-night flex items-center gap-2 border border-white/35 px-3 py-2 text-sm font-bold text-white/75 transition-colors hover:border-white hover:bg-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none motion-reduce:transition-none"
                                    >
                                        <SkipForwardIcon className="size-4" />
                                        Skip
                                    </button>
                                </div>
                            </div>
                        </div>

                        <footer className="flex items-end justify-between border-t border-white/20 pt-3">
                            <Link href="/host">
                                <BrandMark compact className="text-2xl" />
                            </Link>
                            <p className="font-code text-xs tracking-[0.16em] text-white/45 uppercase">
                                Press F for fullscreen
                            </p>
                        </footer>
                    </section>

                    <aside className="flex min-h-0 flex-col border-t border-white/20 pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
                        <div className="flex items-center justify-between border-b-2 border-white/65 pb-4">
                            <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em]">
                                Up next
                            </h2>
                            <RoomCode
                                code={room?.code ?? ""}
                                label="Join"
                                className="items-end [&>span:last-child]:text-2xl"
                            />
                        </div>
                        <Queue roomId={roomId} className="min-h-0 flex-1" />
                        {isDemocraSchedule && <Standings roomId={roomId} />}
                        <div className="grid grid-cols-[7rem_1fr] items-center gap-4 border-t-2 border-white/65 pt-4">
                            <RoomQRCode roomCode={room?.code ?? ""} />
                            <p className="text-sm leading-snug text-white/65">
                                Scan to join, or visit{" "}
                                <b className="text-white">{SITE_NAME}</b> and
                                enter the code above.
                            </p>
                        </div>
                    </aside>
                </div>

                {!currentSong && <EmptyBroadcast code={room?.code ?? ""} />}
            </main>
            <Fullscreen />
        </div>
    )
}

function EmptyBroadcast({ code }: { code: string }) {
    return (
        <section className="absolute inset-0 flex flex-col">
            <header className="flex items-center justify-between border-b border-white/25 pb-4">
                <BrandMark compact className="text-3xl xl:text-4xl" />
                <span className="font-code flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white/55 uppercase">
                    <span className="bg-signal size-2 animate-pulse rounded-full motion-reduce:animate-none" />
                    Ready to broadcast
                </span>
            </header>

            <div className="grid min-h-0 flex-1 gap-10 py-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center xl:gap-20">
                <div>
                    <p className="font-code text-signal text-sm font-bold tracking-[0.2em] uppercase">
                        Join the room
                    </p>
                    <RoomCode
                        code={code}
                        label="Enter this code"
                        className="mt-5 [&>span:last-child]:text-[clamp(5rem,13vw,13rem)]"
                    />
                    <p className="mt-8 max-w-3xl text-2xl leading-tight text-white/60 xl:text-4xl">
                        Visit <b className="text-white">{SITE_NAME}</b>, enter
                        the code, and choose the first track together.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6 lg:items-stretch">
                    <div className="mx-auto aspect-square w-full max-w-sm border-[10px] border-white bg-white p-4 shadow-[16px_16px_0_0_#ff593d] lg:max-w-md">
                        <RoomQRCode roomCode={code} />
                    </div>
                    <p className="font-code text-center text-xs font-bold tracking-[0.18em] text-white/55 uppercase">
                        Point any phone camera here
                    </p>
                </div>
            </div>

            <div className="text-broadcast pointer-events-none absolute bottom-0 left-0 -z-10 h-2/5 w-2/3 opacity-20">
                <TallyField />
            </div>
        </section>
    )
}
