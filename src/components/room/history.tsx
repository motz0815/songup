"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { ScrollArea } from "../ui/scroll-area"
import { SongCard } from "../songs/song-card"
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

    return (
        <ScrollArea className="h-[320px] rounded-lg border border-white/20 bg-white/10 shadow-md backdrop-blur-lg">
            <ul className="space-y-4 p-4">
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

            {historySongs.length > 0 && playlistId && (
            <div className="flex justify-center mt-3">
                <a
                href={`https://music.youtube.com/playlist?list=${playlistId}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open playlist in YouTube Music"
                className="
                    inline-flex items-center gap-2
                    rounded-lg bg-[#FF0033] px-4 py-2
                    font-medium text-white
                    hover:bg-[#E6002E]
                    transition
                    shadow-md
                "
                >
                <img
                    src="/ytmusic.svg"
                    alt=""
                    className="h-6 w-6 flex-shrink-0"
                />
                <span className="text-sm md:text-base">Open in YouTube Music</span>
                </a>
            </div>
            )}
        </ScrollArea>
    )
}

