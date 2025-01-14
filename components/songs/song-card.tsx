"use client"

import { cn } from "@/lib/utils"
import { Song } from "@/types/global"
import { Trash2Icon } from "lucide-react"
import { Button } from "../ui/button"
import { ImageWithFallback } from "../ui/image-with-fallback"

export function SongCard({
    song,
    active,
    onClick,
    onDelete,
}: {
    song: Song
    active?: boolean
    onClick?: () => void
    onDelete?: () => void
}) {
    return (
        <div
            className={cn(
                "group relative flex items-center space-x-4 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md transition-all",
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
                <p className="text-lg text-gray-300">
                    Added by {song.added_by_name}
                </p>
            </div>
            {onDelete && (
                <div className="absolute right-0 top-0 z-10 hidden group-hover:block">
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
            )}
        </div>
    )
}
