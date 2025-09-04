"use client"

import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { ImageWithFallback } from "../image-with-fallback"

export function SongCard({ song }: { song: Doc<"queuedSongs"> }) {
    // Fetch the nickname of the user who added the song
    let nickname = null
    if (song.addedBy) {
        nickname = useQuery(api.nicknames.getNicknameByUserId, {
            userId: song.addedBy,
        })
    }

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
            <div className="w-full">
                <h4 className="text-lg font-semibold text-shadow-md md:text-xl">
                    {song.title}
                </h4>
                <p className="text-sm text-gray-100 text-shadow-sm md:text-lg">
                    {song.artist}
                </p>
            </div>
            <div>
                {nickname && (
                    <p className="text-right text-sm text-nowrap text-gray-100 text-shadow-sm md:text-lg">
                        by {nickname}
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
