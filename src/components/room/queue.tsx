"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useQuery } from "convex/react"
import { ImageWithFallback } from "../image-with-fallback"
import { ScrollArea } from "../ui/scroll-area"

export function Queue({ roomId }: { roomId: Id<"rooms"> }) {
    const queue = useQuery(api.rooms.getPersonalQueue, {
        roomId,
    })

    const [animationParent] = useAutoAnimate<HTMLUListElement>()

    return (
        <ScrollArea className="h-full max-h-[40vh] grow overflow-y-auto">
            <ul ref={animationParent}>
                {queue && queue.length > 0 ? (
                    queue.map((song) => (
                        <li key={song._id}>
                            <div className="group border-ink/25 relative flex items-center justify-between gap-4 border-b py-4 transition-colors hover:bg-white/35">
                                <ImageWithFallback
                                    src={`https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`}
                                    width={128}
                                    height={128}
                                    alt={`${song.title}`}
                                    className="aspect-video h-16 w-28 shrink-0 object-cover sm:h-20 sm:w-36"
                                    unoptimized
                                />
                                <div className="w-full">
                                    <h4 className="font-display text-lg leading-tight font-bold tracking-[-0.025em] md:text-xl">
                                        {song.title}
                                    </h4>
                                    <p className="text-ink/55 mt-1 text-sm md:text-base">
                                        {song.artist}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="border-ink/25 text-ink/55 border-b py-5">
                        Your queue is clear. Add something when inspiration
                        strikes.
                    </p>
                )}
            </ul>
        </ScrollArea>
    )
}
