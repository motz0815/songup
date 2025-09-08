"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useQuery } from "convex/react"
import { SongCard } from "../songs/song-card"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"

export function Queue({ roomId }: { roomId: Id<"rooms"> }) {
    const queue = useQuery(api.rooms.getQueue, {
        roomId,
        numItems: 10,
    })

    const [animationParent] = useAutoAnimate()

    return (
        <ScrollArea className="rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
            <ul ref={animationParent} className="space-y-4">
                {queue && queue.length > 0 ? (
                    queue.map((song, index) => {
                        const isTransition =
                            index > 0 &&
                            queue[index - 1].type === "addedByUser" &&
                            song.type === "fallback"

                        return (
                            <li key={song._id}>
                                {isTransition && (
                                    <div className="mb-4">
                                        <Separator className="bg-white/30" />
                                    </div>
                                )}
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
