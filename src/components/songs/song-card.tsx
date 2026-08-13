"use client"

import { cn } from "@/lib/utils"
import { ImageWithFallback } from "../image-with-fallback"
import { ServiceLinks } from "./service-links"

export type SongView = {
    id: string,
    videoId: string,
    title: string,
    artist: string,
    duration: number,
    addedByNickname?: string,
    /** Where else this song can be heard. Only history knows these. */
    links?: Record<string, string>,
}

export function SongCard({
    song,
}: {
    song: SongView
}) {
    return (
        <div
            className={cn(
                "group relative flex items-center justify-between space-x-4 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md transition-all",
            )}
            // onClick={onClick}
        >
            <ImageWithFallback
                src={`https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`}
                width={128}
                height={128}
                alt={`${song.title}`}
                className="aspect-video h-20 rounded-lg border border-white/20 object-cover"
                unoptimized
            />
            <div className="w-full min-w-0">
                <h4 className="text-lg font-semibold text-shadow-md md:text-xl">
                    {song.title}
                </h4>
                <p className="text-sm text-gray-100 text-shadow-sm md:text-lg">
                    {song.artist}
                </p>
                <ServiceLinks links={song.links} className="mt-1.5" />
            </div>
            <div>
                {song.addedByNickname && (
                    <p className="text-right text-sm text-nowrap text-gray-100 text-shadow-sm md:text-lg">
                        by {song.addedByNickname}
                    </p>
                )}
            </div>
            {/* {onDelete && (
                <div className="absolute top-0 right-0 z-10 hidden group-hover:block">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete()
                        }}
                    >
                        <Trash2Icon className="size-4" />
                    </Button>
                </div>
            )} */}
        </div>
    )
}
