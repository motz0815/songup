"use client"

import { NicknameForm } from "@/components/auth/nickname-form"
import { BrandMark } from "@/components/brand/brand-mark"
import { RoomCode } from "@/components/brand/room-code"
import { TallyField } from "@/components/brand/tally-field"
import { AddSong } from "@/components/room/add-song"
import { NowPlaying } from "@/components/room/current-song"
import { ExportPlaylist } from "@/components/room/export-playlist"
import { History } from "@/components/room/history"
import { Queue } from "@/components/room/queue"
import { VoteControls } from "@/components/room/vote-controls"
import { YourStanding } from "@/components/room/your-standing"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { HEARTBEAT_INTERVAL_MS } from "@/convex/settings"
import { useAuthedMutation } from "@/lib/auth"
import {
    Preloaded,
    useConvexAuth,
    usePreloadedQuery,
    useQuery,
} from "convex/react"
import { ArrowLeft, Radio } from "lucide-react"
import Link from "next/link"
import { useEffect, useEffectEvent } from "react"

export default function Room({
    roomId,
    preloadedRoom,
}: {
    roomId: Id<"rooms">
    // @ts-ignore
    preloadedRoom: Preloaded<typeof api.rooms.getRoomByCode>
}) {
    const room = usePreloadedQuery(preloadedRoom)
    const { isLoading, isAuthenticated } = useConvexAuth()
    const nickname = useQuery(api.nicknames.getNickname)
    const songsLeftToAdd = useQuery(api.rooms.getSongsLeftToAdd, { roomId })
    const queuePreview = useQuery(api.rooms.getQueue, {
        roomId,
        numItems: 1,
    })

    const heartbeat = useAuthedMutation(api.voting.heartbeat)
    const sendHeartbeat = useEffectEvent(() => {
        void heartbeat({ roomId }).catch(() => {
            // The next heartbeat repairs a missed presence update.
        })
    })

    useEffect(() => {
        if (!isAuthenticated) return

        sendHeartbeat()
        const intervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)
        return () => clearInterval(intervalId)
    }, [roomId, isAuthenticated])

    const currentSong = room?.currentSong ?? null
    const hasQueuedSong = Boolean(queuePreview?.length)
    const isDemocraSchedule = room?.settings?.scheduler === "weighted"

    return (
        <div className="paper-field text-ink min-h-screen">
            <div className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-8 sm:py-7">
                <RoomHeader code={room?.code ?? ""} />

                {isLoading || nickname === undefined ? (
                    <main className="flex min-h-[70svh] items-center">
                        <p className="font-code text-sm font-bold tracking-[0.16em] uppercase">
                            Tuning in…
                        </p>
                    </main>
                ) : !nickname ? (
                    <main className="grid min-h-[calc(100svh-7rem)] items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr]">
                        <section>
                            <h1 className="font-display max-w-3xl text-5xl leading-[0.88] font-extrabold tracking-[-0.06em] text-balance sm:text-8xl sm:leading-[0.86] sm:tracking-[-0.07em]">
                                What should the room call you?
                            </h1>
                            <p className="text-ink/60 mt-6 max-w-xl text-lg">
                                This nickname labels your songs and votes for
                                this room. No account, email, or password.
                            </p>
                            <div className="border-ink mt-9 max-w-md border-y-2 py-5">
                                <NicknameForm />
                            </div>
                        </section>
                        <div className="text-broadcast hidden h-[28rem] opacity-50 lg:block">
                            <TallyField />
                        </div>
                    </main>
                ) : !currentSong && !hasQueuedSong ? (
                    <main className="grid min-h-[calc(100svh-7rem)] items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr]">
                        <section>
                            <h1 className="font-display max-w-3xl text-5xl leading-[0.88] font-extrabold tracking-[-0.06em] text-balance sm:text-8xl sm:leading-[0.86] sm:tracking-[-0.07em]">
                                Pick the first track.
                            </h1>
                            <p className="text-ink/60 mt-6 max-w-xl text-lg">
                                Search for something worth starting with. Once
                                playback begins, the whole room gets a vote.
                            </p>
                            <div className="mt-9 max-w-2xl">
                                <AddSong
                                    roomId={roomId}
                                    inline
                                    disabled={(songsLeftToAdd ?? 0) <= 0}
                                />
                            </div>
                        </section>
                        <div className="text-signal hidden h-[30rem] opacity-35 lg:block">
                            <TallyField />
                        </div>
                    </main>
                ) : !currentSong ? (
                    <main className="py-14 sm:py-20">
                        <p className="font-code text-broadcast flex items-center gap-2 text-sm font-bold tracking-[0.18em] uppercase">
                            <Radio className="size-4" /> Queue ready
                        </p>
                        <div className="border-ink mt-4 grid gap-8 border-t-2 pt-6 lg:grid-cols-[1.15fr_0.85fr]">
                            <div>
                                <h1 className="font-display text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-7xl">
                                    The first track is waiting for the host.
                                </h1>
                                <p className="text-ink/60 mt-5 max-w-xl text-lg">
                                    You’re queued as <b>{nickname}</b>. Add
                                    another while the host starts playback.
                                </p>
                                <AddSong
                                    roomId={roomId}
                                    prominent
                                    disabled={(songsLeftToAdd ?? 0) <= 0}
                                />
                            </div>
                            <section>
                                <SectionLabel>Your queue</SectionLabel>
                                <Queue roomId={roomId} />
                            </section>
                        </div>
                    </main>
                ) : (
                    <main className="py-10 sm:py-14">
                        <section>
                            <SectionLabel>Now broadcasting</SectionLabel>
                            <NowPlaying currentSong={currentSong} />
                            <VoteControls
                                roomId={roomId}
                                videoId={currentSong.videoId}
                            />
                        </section>

                        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-12">
                                <section>
                                    <div className="border-ink flex flex-wrap items-end justify-between gap-4 border-b-2 pb-4">
                                        <div>
                                            <SectionLabel>
                                                Your queue
                                            </SectionLabel>
                                            <p className="text-ink/55 mt-2 text-sm">
                                                {songsLeftToAdd == null
                                                    ? "Checking your limit…"
                                                    : songsLeftToAdd > 0
                                                      ? `${songsLeftToAdd} more ${songsLeftToAdd === 1 ? "track" : "tracks"} available`
                                                      : "Your queue is full for now"}
                                            </p>
                                        </div>
                                        <AddSong
                                            roomId={roomId}
                                            prominent
                                            disabled={
                                                (songsLeftToAdd ?? 0) <= 0
                                            }
                                        />
                                    </div>
                                    <Queue roomId={roomId} />
                                </section>

                                {isDemocraSchedule && (
                                    <section>
                                        <SectionLabel>
                                            Your standing
                                        </SectionLabel>
                                        <YourStanding roomId={roomId} />
                                    </section>
                                )}
                            </div>

                            <section>
                                <SectionLabel>Played tonight</SectionLabel>
                                <History
                                    roomId={roomId}
                                    playlistId={room?.playlistId}
                                />
                                <ExportPlaylist
                                    roomId={roomId}
                                    roomCode={room?.code ?? ""}
                                />
                            </section>
                        </div>
                    </main>
                )}
            </div>
        </div>
    )
}

function RoomHeader({ code }: { code: string }) {
    return (
        <header className="border-ink flex items-center justify-between gap-4 border-b-2 pb-4">
            <Link href="/" className="flex items-center gap-3">
                <ArrowLeft className="size-5" />
                <BrandMark compact className="text-xl sm:text-2xl" />
            </Link>
            <RoomCode
                code={code}
                label="Room"
                className="items-end [&>span:last-child]:text-2xl sm:[&>span:last-child]:text-3xl"
            />
        </header>
    )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="font-code text-xs font-bold tracking-[0.18em] uppercase opacity-60">
            {children}
        </h2>
    )
}
