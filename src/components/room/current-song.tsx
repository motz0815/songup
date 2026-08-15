"use client"

import type { Doc } from "@/convex/_generated/dataModel"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { ImageWithFallback } from "../image-with-fallback"

type CurrentSongType =
    | (Doc<"rooms">["currentSong"] & {
          addedByNickname?: string
      })
    | null

export function NowPlaying({ currentSong }: { currentSong: CurrentSongType }) {
    const [animationParent] = useAutoAnimate<HTMLDivElement>({
        duration: 300, // slightly slower for nicer effect
        easing: "ease-in-out",
    })

    return (
        <div ref={animationParent} className="mt-3 flex flex-col gap-2">
            {currentSong ? (
                <div
                    key={`${currentSong.videoId}-${currentSong.addedBy ?? ""}`}
                    className="border-ink grid gap-5 border-y-2 py-5 transition-all sm:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)] sm:items-end"
                >
                    <ImageWithFallback
                        src={`https://i.ytimg.com/vi_webp/${currentSong.videoId}/mqdefault.webp`}
                        width={960}
                        height={540}
                        alt={`${currentSong.title}`}
                        className="aspect-video w-full object-cover"
                        unoptimized
                    />
                    <div className="pb-1">
                        <h4 className="font-display text-3xl leading-none font-extrabold tracking-[-0.045em] sm:text-5xl">
                            {currentSong.title}
                        </h4>
                        <p className="text-ink/60 mt-3 text-lg sm:text-xl">
                            {currentSong.artist}
                        </p>
                        {currentSong.addedByNickname && (
                            <p className="text-ink/50 mt-6 text-sm font-semibold">
                                Added by {currentSong.addedByNickname}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="border-ink border-y-2 py-5">
                    <p className="text-center">No song playing.</p>
                </div>
            )}
        </div>
    )
}
