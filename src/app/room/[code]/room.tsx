"use client"

import { NicknameForm } from "@/components/auth/nickname-form"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { AddSong } from "@/components/room/add-song"
import { Queue } from "@/components/room/queue"
import { NowPlaying } from "@/components/room/current-song"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import {
    Preloaded,
    useConvexAuth,
    usePreloadedQuery,
    useQuery,
} from "convex/react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { History } from "@/components/room/history"

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

    const currentSong = room?.currentSong

    const songsLeftToAdd = useQuery(api.rooms.getSongsLeftToAdd, {
        roomId,
    })

    const nickname = useQuery(api.nicknames.getNickname)

    /*
     * OTHER STATE
     */

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-500 to-indigo-950 text-white">
            <div className="mx-auto h-full max-w-screen-lg p-4">
                <header className="mb-6 flex w-full items-center justify-between">
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <ArrowLeft className="size-6" />
                            <h1 className="text-xl font-bold">SongUp</h1>
                        </div>
                    </Link>
                    <h2 className="text-xl">
                        <span className="font-bold">{room?.code}</span>
                    </h2>
                </header>
                <main className="flex flex-col gap-4">
                    <section className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Now Playing</h2>
                        <NowPlaying currentSong={currentSong ?? null} />
                    </section>
                    <section className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Your Queue</h2>
                        <Queue roomId={roomId} />
                    </section>
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
                                                You can&apos;t add any more
                                                songs at the moment.
                                            </p>
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

                    <section className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Song History</h2>
                        < History roomId={roomId} playlistId={room?.playlistId}/>
                    </section>
                </main>
            </div>
        </div>
    )
}
