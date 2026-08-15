"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useQuery } from "convex/react"
import type { SongView } from "../songs/song-card"
import { SongCard } from "../songs/song-card"
import { ScrollArea } from "../ui/scroll-area"

export function History({
    roomId,
    playlistId,
}: {
    roomId: Id<"rooms">
    playlistId: string | undefined
}) {
    // @ts-ignore
    const history = useQuery(api.rooms.getSongHistory, { roomId }) ?? []

    const historySongs: SongView[] = history.map((song) => ({
        id: song._id,
        videoId: song.videoId,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        addedByNickname: song.addedByNickname,
        links: song.links,
    }))

    const [animationParent] = useAutoAnimate<HTMLUListElement>()

    return (
        <div className="flex flex-col gap-2">
            <ScrollArea className="border-ink mt-3 h-[420px] border-y-2">
                <ul ref={animationParent}>
                    {historySongs.length > 0 ? (
                        historySongs.map((song) => (
                            <li key={song.id}>
                                <SongCard song={song} tone="light" />
                            </li>
                        ))
                    ) : (
                        <p className="text-ink/50 py-6">
                            History starts when the first track finishes.
                        </p>
                    )}
                </ul>
            </ScrollArea>

            {/* Sits below the list rather than floating over it - as an overlay
                it covered whichever song happened to be scrolled underneath. */}
            {playlistId && (
                <a
                    href={`https://music.youtube.com/playlist?list=${playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-ink focus-visible:ring-broadcast/35 flex items-center justify-center gap-2 border-2 bg-[#ff0033] px-4 py-3 font-bold text-white transition-colors duration-200 hover:bg-[#e6002e] focus-visible:ring-4 focus-visible:outline-none motion-reduce:transition-none"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/ytmusic.svg"
                        alt=""
                        className="h-6 w-6 shrink-0"
                    />
                    <span className="text-sm md:text-base">
                        Open in YouTube Music
                    </span>
                </a>
            )}
        </div>
    )
}
