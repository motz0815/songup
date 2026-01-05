"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { ScrollArea } from "../ui/scroll-area"
import { SongCard } from "../songs/song-card"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import type { SongView } from "../songs/song-card"

export function History({ roomId, playlistId }: { roomId: Id<"rooms">, playlistId: string | undefined }) {
    const history = useQuery(api.rooms.getSongHistory, { roomId }) ?? []

    const historySongs: SongView[] = history.map(song => ({
        id: song._id,
        videoId: song.videoId,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        addedByNickname: song.addedByNickname,
    }))

    const [animationParent] = useAutoAnimate<HTMLUListElement>()

    return (
        <ScrollArea className="h-[320px] rounded-lg border border-white/20 bg-white/10 shadow-md backdrop-blur-lg">
            <ul ref={animationParent} className="space-y-4 p-4">
                {historySongs.length > 0 ? (
                    historySongs.map(song => (
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

            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-[90%] md:w-auto">
                <a
                    href={playlistId ? `https://music.youtube.com/playlist?list=${playlistId}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open playlist in YouTube Music"
                    className={`
                        flex items-center justify-center gap-2
                        rounded-lg bg-[#FF0033] px-4 py-2
                        font-medium text-white
                        shadow-md
                        transition-all duration-300
                        ${playlistId ? 'hover:bg-[#E6002E] cursor-pointer scale-100' : 'opacity-50 cursor-not-allowed scale-95'}
                    `}
                >
                    <img
                        src="/ytmusic.svg"
                        alt=""
                        className="h-6 w-6 flex-shrink-0"
                    />
                    <span className="text-sm md:text-base">Open in YouTube Music</span>
                </a>
            </div>
        </ScrollArea>
    )
}

