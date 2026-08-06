"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useQuery } from "convex/react"
import { SongCard } from "../songs/song-card"
import { ScrollArea } from "../ui/scroll-area"
import type { SongView } from "../songs/song-card"

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
    const queue = useQuery(api.rooms.getQueue, {
        roomId,
        numItems: HOST_QUEUE_LENGTH,
    }) ?? []

    const queueSongs: SongView[] = queue.map(song => ({
        id: song._id,
        videoId: song.videoId,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        addedByNickname: song.addedByNickname,
    }))

    const [animationParent] = useAutoAnimate()

    return (
        <ScrollArea
            className={cn(
                "rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg",
                className,
            )}
        >
            <ul ref={animationParent} className="space-y-4">
                {queueSongs.length > 0 ? (
                    queueSongs.map((song) => {
                        return (
                            <li key={song.id}>
                                <SongCard song={song} />
                            </li>
                        )
                    })
                ) : (
                    <p className="text-center text-lg">
                        No songs in queue. Use the QR code to add some!
                    </p>
                )}
            </ul>
        </ScrollArea>
    )
}
