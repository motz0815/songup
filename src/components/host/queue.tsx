"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useQuery } from "convex/react"
import { SongCard } from "../songs/song-card"
import { ScrollArea } from "../ui/scroll-area"

export function Queue({ roomId }: { roomId: Id<"rooms"> }) {
    const queue = useQuery(api.rooms.getQueue, {
        roomId,
    })

    const [animationParent] = useAutoAnimate()

    return (
        <ScrollArea className="rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
            <ul ref={animationParent} className="space-y-4">
                {queue && queue.page.length > 0 ? (
                    queue.page.map((song) => (
                        <li key={song._id}>
                            <SongCard song={song} />
                        </li>
                    ))
                ) : (
                    <p className="text-center text-lg">
                        No songs in queue. Use the QR code to add some!
                    </p>
                )}
            </ul>
        </ScrollArea>
    )
}
