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
            <ScrollArea className="h-[320px] rounded-lg border border-white/20 bg-white/10 shadow-md backdrop-blur-lg">
                <ul ref={animationParent} className="space-y-4 p-4">
                    {historySongs.length > 0 ? (
                        historySongs.map((song) => (
                            <li key={song.id}>
                                <SongCard song={song} />
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-white/70">
                            No songs played yet.
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
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#FF0033] px-4 py-2 font-medium text-white shadow-md transition-colors duration-200 hover:bg-[#E6002E] focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none motion-reduce:transition-none"
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
