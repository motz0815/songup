"use client"

import { BrandMark } from "@/components/brand/brand-mark"
import { RoomCode } from "@/components/brand/room-code"
import { TallyField } from "@/components/brand/tally-field"
import { CreateRoom } from "@/components/host/create-room"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { formatDistance } from "date-fns"
import { ArrowLeft, ArrowUpRight, PlusIcon, Radio } from "lucide-react"
import Link from "next/link"

export default function ManageRooms({
    preloadedRooms,
}: {
    preloadedRooms: Preloaded<typeof api.rooms.manage.listOwnRooms>
}) {
    const rooms = usePreloadedQuery(preloadedRooms)
    const hasRooms = Boolean(rooms?.length)

    return (
        <main className="paper-field relative min-h-screen overflow-hidden px-5 py-6 sm:px-10 sm:py-8">
            <div className="mx-auto max-w-7xl">
                <header className="border-ink flex items-center justify-between border-b-2 pb-5">
                    <Link href="/" className="flex items-center gap-3">
                        <ArrowLeft className="size-5" />
                        <BrandMark compact className="text-2xl sm:text-3xl" />
                    </Link>
                    {hasRooms && (
                        <CreateRoom>
                            <Button className="border-ink bg-signal hover:bg-signal/90 rounded-none border-2 font-bold text-white">
                                <PlusIcon className="size-4" /> Create room
                            </Button>
                        </CreateRoom>
                    )}
                </header>

                {!hasRooms ? (
                    <section className="grid min-h-[calc(100svh-7rem)] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <h1 className="font-display max-w-4xl text-5xl leading-[0.88] font-extrabold tracking-[-0.06em] text-balance sm:text-8xl sm:leading-[0.85] sm:tracking-[-0.07em] lg:text-9xl">
                                Start the room. Let them choose.
                            </h1>
                            <p className="text-ink/65 mt-6 max-w-xl text-lg sm:text-xl">
                                Start a room, put its QR code on the big screen,
                                and let everyone build the queue together.
                            </p>
                            <CreateRoom>
                                <Button className="border-ink bg-signal hover:bg-signal/90 mt-9 h-14 rounded-none border-2 px-7 text-base font-bold text-white">
                                    Create your first room
                                    <ArrowUpRight className="size-5" />
                                </Button>
                            </CreateRoom>
                        </div>
                        <div className="text-broadcast hidden h-[32rem] opacity-65 lg:block">
                            <TallyField />
                        </div>
                    </section>
                ) : (
                    <section className="py-14 sm:py-20">
                        <div className="mb-12 grid gap-4 sm:grid-cols-2 sm:items-end">
                            <div>
                                <h1 className="font-display text-5xl leading-none font-extrabold tracking-[-0.055em] sm:text-8xl sm:tracking-[-0.065em]">
                                    Your rooms
                                </h1>
                            </div>
                            <p className="text-ink/60 max-w-md sm:justify-self-end sm:text-right">
                                Open a room to put it on the big screen. Rooms
                                expire automatically after 48 hours.
                            </p>
                        </div>

                        <div className="border-ink border-t-2">
                            {rooms?.map((room) => {
                                const expiresSoon =
                                    room.expiresAt - Date.now() <
                                    6 * 60 * 60 * 1000

                                return (
                                    <Link
                                        href={`/host/${room.code}`}
                                        key={room.code}
                                        className="group border-ink focus-visible:ring-broadcast/35 grid gap-6 border-b-2 py-7 transition-colors hover:bg-white/45 focus-visible:bg-white/60 focus-visible:ring-4 focus-visible:outline-none sm:grid-cols-[0.75fr_0.85fr_1.4fr_auto] sm:items-center sm:px-3"
                                    >
                                        <RoomCode
                                            code={room.code}
                                            className="[&>span:last-child]:text-[clamp(2.6rem,5vw,4.75rem)]"
                                        />
                                        <div>
                                            <span className="font-code flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase">
                                                <Radio className="text-signal size-4" />
                                                {room.currentSong
                                                    ? "Live now"
                                                    : "Ready to start"}
                                            </span>
                                            <p
                                                className={`mt-2 text-sm ${expiresSoon ? "text-destructive" : "text-ink/55"}`}
                                            >
                                                Expires{" "}
                                                {formatDistance(
                                                    new Date(room.expiresAt),
                                                    Date.now(),
                                                    { addSuffix: true },
                                                )}
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            {room.currentSong ? (
                                                <div className="flex items-center gap-4">
                                                    <ImageWithFallback
                                                        src={`https://i.ytimg.com/vi_webp/${room.currentSong.videoId}/mqdefault.webp`}
                                                        width={160}
                                                        height={90}
                                                        alt=""
                                                        className="aspect-video h-16 w-28 shrink-0 object-cover"
                                                        unoptimized
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold">
                                                            {
                                                                room.currentSong
                                                                    .title
                                                            }
                                                        </p>
                                                        <p className="text-ink/55 truncate text-sm">
                                                            {
                                                                room.currentSong
                                                                    .artist
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="font-display text-ink/45 text-2xl font-bold tracking-[-0.03em]">
                                                    Waiting for the first track
                                                </p>
                                            )}
                                        </div>
                                        <ArrowUpRight className="size-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}
