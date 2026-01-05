"use client"

import { useAutoAnimate } from "@formkit/auto-animate/react"
import { ImageWithFallback } from "../image-with-fallback"
import { cn } from "@/lib/utils"
import type { Doc } from "@/convex/_generated/dataModel"

type CurrentSongType = (Doc<"rooms">["currentSong"] & {
  addedByNickname?: string;
}) | null;

export function NowPlaying({ currentSong }: { currentSong: CurrentSongType }) {
    const [animationParent] = useAutoAnimate<HTMLDivElement>({
        duration: 300, // slightly slower for nicer effect
        easing: "ease-in-out",
    })

    return (
        <div ref={animationParent} className="flex flex-col gap-2">
            {currentSong ? (
                <div
                    key={`${currentSong.videoId}-${currentSong.addedBy ?? ""}`}
                    className={cn(
                        "flex items-center space-x-4 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md transition-all"
                    )}
                >
                    <ImageWithFallback
                        src={`https://i.ytimg.com/vi_webp/${currentSong.videoId}/mqdefault.webp`}
                        width={128}
                        height={128}
                        alt={`${currentSong.title}`}
                        className="aspect-video h-20 rounded-lg border border-white/20 object-cover"
                        unoptimized
                    />
                    <div>
                        <h4 className="text-lg font-semibold text-shadow-md md:text-xl">
                            {currentSong.title}
                        </h4>
                        <p className="text-sm text-gray-100 text-shadow-sm md:text-lg">
                            {currentSong.artist}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-lg border border-white/20 bg-white/10 p-3 shadow-md">
                    <p className="text-center">No song playing.</p>
                </div>
            )}
        </div>
    )
}
