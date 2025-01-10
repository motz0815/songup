"use client"

import { cn } from "@/lib/utils"
import { Song } from "@/types/global"
import { ImageWithFallback } from "../ui/image-with-fallback"

export function SongCard({
    song,
    active,
    onClick,
}: {
    song: Song
    active?: boolean
    onClick?: () => void
}) {
    return (
        <div
            className={cn(
                "flex items-center space-x-4 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md backdrop-blur-lg",
                {
                    "bg-white/30": active,
                    "hover:cursor-pointer": onClick,
                },
            )}
            onClick={onClick}
        >
            <ImageWithFallback
                src={`https://i.ytimg.com/vi_webp/${song.video_id}/mqdefault.webp`}
                width={128}
                height={128}
                alt={`${song.title}`}
                className="aspect-video h-20 rounded-md object-cover"
            />
            <div>
                <h4 className="text-xl font-semibold">{song.title}</h4>
                <p className="text-lg text-gray-300">{song.added_by_name}</p>
            </div>
        </div>
    )
}
