"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useMutation, useQuery } from "convex/react"
import { ListStartIcon, Trash2Icon } from "lucide-react"
import { ImageWithFallback } from "../image-with-fallback"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

export function Queue({ roomId }: { roomId: Id<"rooms"> }) {
    const room = useQuery(api.rooms.getRoom, {
        roomId,
    })

    const queue = useQuery(api.rooms.getQueue, {
        roomId,
    })

    const user = useQuery(api.auth.getCurrentUser)

    const isHostAndPro =
        room?.proStatus === "active" && room?.host === user?._id

    const playQueuedSongNext = useMutation(
        api.rooms.controls.playQueuedSongNext,
    )

    const deleteSong = useMutation(api.rooms.controls.deleteSong)

    const [animationParent] = useAutoAnimate()

    return (
        <ScrollArea className="h-full max-h-[40vh] grow overflow-y-auto rounded-lg border border-white/20 bg-white/10 p-3 shadow-md backdrop-blur-lg">
            <ul ref={animationParent} className="space-y-4">
                {queue && queue.length > 0 ? (
                    queue.map((song, index) => (
                        <li key={song._id}>
                            <div className="group relative flex items-center justify-between space-x-4 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md transition-all">
                                <ImageWithFallback
                                    src={`https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`}
                                    width={128}
                                    height={128}
                                    alt={`${song.title}`}
                                    className="aspect-video h-12 rounded-lg border border-white/20 object-cover md:h-20"
                                    unoptimized
                                />
                                <div className="w-full">
                                    <h4 className="text-md font-semibold text-shadow-md sm:text-lg md:text-xl">
                                        {song.title}
                                    </h4>
                                    <p className="text-xs text-gray-100 text-shadow-sm sm:text-sm md:text-lg">
                                        {song.artist}
                                    </p>
                                </div>
                                {isHostAndPro && index !== 0 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            playQueuedSongNext({
                                                roomId,
                                                songId: song._id,
                                            })
                                        }}
                                    >
                                        <ListStartIcon />
                                    </Button>
                                )}
                                {isHostAndPro && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            deleteSong({
                                                roomId,
                                                songId: song._id,
                                            })
                                        }}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-center">No songs in queue. Add some!</p>
                )}
            </ul>
        </ScrollArea>
    )
}
