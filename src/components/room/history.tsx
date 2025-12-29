"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { ScrollArea } from "../ui/scroll-area"
import { SongCard } from "../songs/song-card"
import type { SongView } from "../songs/song-card"

export function History({ roomId }: { roomId: Id<"rooms"> }) {
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
        <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Song History</h2>

            <ScrollArea
                className="h-[320px] rounded-lg border border-white/20 bg-white/10 shadow-md backdrop-blur-lg"
            >
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
            </ScrollArea>
        </section>
    )
}

