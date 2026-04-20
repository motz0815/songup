"use client"

import { NicknameForm } from "@/components/auth/nickname-form"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { AddSong } from "@/components/room/add-song"
import { Queue } from "@/components/room/queue"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import {
    Preloaded,
    useConvexAuth,
    useMutation,
    usePreloadedQuery,
    useQuery,
} from "convex/react"
import { ArrowLeft, SkipForwardIcon } from "lucide-react"
import Link from "next/link"

export default function Room({
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
    const { isLoading } = useConvexAuth()

    const user = useQuery(api.auth.getCurrentUser)

    const currentSong = room?.currentSong

    const songsLeftToAdd = useQuery(api.rooms.getSongsLeftToAdd, {
        roomId,
    })

    const skipToNextSong = useMutation(api.rooms.controls.skipToNextSong)

    const nickname = useQuery(api.nicknames.getNickname)

    const isHost = room?.host === user?._id
    const isPro = room?.proStatus === "active"

    /*
     * OTHER STATE
     */

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-500 to-indigo-950 text-white">
            <div className="mx-auto h-full max-w-5xl p-4">
                <header className="mb-6 flex w-full items-center justify-between">
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <ArrowLeft className="size-6" />
                            <h1 className="text-xl font-bold">
                                SongUp {room?.proStatus === "active" && "Pro"}{" "}
                                {isHost && isPro && "(Host)"}
                            </h1>
                        </div>
                    </Link>
                    <h2 className="text-xl">
                        <span className="font-bold">{room?.code}</span>
                    </h2>
                </header>
                <main className="flex flex-col gap-4">
                    <section className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Now Playing</h2>
                        {currentSong ? (
                            <div
                                className={cn(
                                    "flex items-center space-x-4 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md transition-all",
                                )}
                            >
                                <ImageWithFallback
                                    src={`https://i.ytimg.com/vi_webp/${currentSong.videoId}/mqdefault.webp`}
                                    width={128}
                                    height={128}
                                    alt={`${currentSong.title}`}
                                    className="aspect-video h-20 rounded-lg border border-white/20 object-cover"
                                    unoptimized
                                />
                                <div>
                                    <h4 className="text-lg font-semibold text-shadow-md md:text-xl">
                                        {currentSong.title}
                                    </h4>
                                    <p className="text-sm text-gray-100 text-shadow-sm md:text-lg">
                                        {currentSong.artist}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-white/20 bg-white/10 p-3 shadow-md">
                                <p className="text-center">No song playing.</p>
                            </div>
                        )}
                    </section>
                    <section className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Up next</h2>
                        <Queue roomId={roomId} />
                    </section>
                    {isHost && isPro && (
                        <section className="flex flex-col gap-2">
                            <h2 className="text-xl font-bold">Host controls</h2>
                            <div className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        skipToNextSong({
                                            roomId,
                                        })
                                    }}
                                >
                                    <SkipForwardIcon /> Skip
                                </Button>
                            </div>
                        </section>
                    )}
                    <section className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Add songs</h2>
                        <div className="rounded-lg border border-white/20 bg-white/10 p-3 shadow-md">
                            <div className="flex flex-col gap-2">
                                {isLoading && <p>Loading...</p>}
                                {nickname ? (
                                    <>
                                        <p>
                                            Logged in as <b>{nickname}</b>
                                        </p>
                                        {isHost && isPro ? (
                                            <p>
                                                You are the host of a pro room.
                                                You can add unlimited songs.
                                            </p>
                                        ) : (
                                            <>
                                                {songsLeftToAdd ? (
                                                    <p>
                                                        You can add up to{" "}
                                                        <span className="font-bold">
                                                            {songsLeftToAdd}
                                                        </span>{" "}
                                                        more songs.
                                                    </p>
                                                ) : (
                                                    <p>
                                                        You can&apos;t add any
                                                        more songs at the
                                                        moment.
                                                    </p>
                                                )}
                                            </>
                                        )}
                                        {/* <SearchSongDialog
                                            addSong={addSong}
                                            open={dialogOpen}
                                            setOpen={setDialogOpen}
                                            disableTrigger={songsLeftToAdd <= 0}
                                        /> */}
                                        <AddSong
                                            roomId={roomId}
                                            disabled={
                                                (songsLeftToAdd ?? 0) <= 0
                                            }
                                        />
                                    </>
                                ) : (
                                    <>{!isLoading && <NicknameForm />}</>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
