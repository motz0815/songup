"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useQuery } from "convex/react"
import type { SongView } from "../songs/song-card"
import { SongCard } from "../songs/song-card"
import { ScrollArea } from "../ui/scroll-area"

/**
 * How far ahead the host screen shows. Exported because the optimistic update
 * on `popSong` has to look up the queue under the exact same arguments, or it
 * silently misses and the song change only lands on the server round trip.
 */
export const HOST_QUEUE_LENGTH = 10

export function Queue({
    roomId,
    className,
}: {
    roomId: Id<"rooms">
    className?: string
}) {
    const queue =
        useQuery(api.rooms.getQueue, {
            roomId,
            numItems: HOST_QUEUE_LENGTH,
        }) ?? []

    const queueSongs: SongView[] = queue.map((song) => ({
        id: song._id,
        videoId: song.videoId,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        addedByNickname: song.addedByNickname,
    }))

    const [animationParent] = useAutoAnimate()

    return (
        <ScrollArea className={cn("py-3", className)}>
            <ul ref={animationParent}>
                {queueSongs.length > 0 ? (
                    queueSongs.map((song) => {
                        return (
                            <li key={song.id}>
                                <SongCard song={song} />
                            </li>
                        )
                    })
                ) : (
                    <p className="py-6 text-white/50">
                        Nothing queued yet. The next guest can change that.
                    </p>
                )}
            </ul>
        </ScrollArea>
    )
}
