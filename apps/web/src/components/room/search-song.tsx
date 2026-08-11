"use client"

import { Input } from "@songup/ui/components/input"
import { SubmitButton } from "@songup/ui/components/submit-button"
import { PlusCircleIcon } from "lucide-react"
import { useState } from "react"
import { ImageWithFallback } from "../image-with-fallback"

export function SearchSong({
    onSelect,
}: {
    onSelect: (song: {
        videoId: string
        title: string
        artist: string
        duration: number
    }) => Promise<void>
}) {
    const [results, setResults] = useState<
        {
            videoId: string
            title: string
            artists: { name: string }[]
            duration_seconds: number
        }[]
    >([])
    const [error, setError] = useState<string | null>(null)

    async function handleSearch(formData: FormData) {
        try {
            const query = formData.get("query") as string
            console.log("Query", query)
            setError(null)
            const results: [] = await fetch(
                `/flask/search?query=${encodeURIComponent(query)}`,
            ).then((res) => res.json())
            console.log("Results", results)
            setResults(results)
        } catch (error) {
            setError("Failed to search for songs. Please try again.")
            console.error(error)
        }
    }

    async function handleSelectSong(formData: FormData) {
        const song = {
            videoId: formData.get("videoId") as string,
            title: formData.get("title") as string,
            artist: formData.get("artist") as string,
            duration: Number(formData.get("duration")),
        }

        try {
            await onSelect(song)
        } catch (error) {
            setError("Failed to select song. Please try again.")
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <form action={handleSearch}>
                <div className="flex w-full gap-2">
                    <Input
                        name="query"
                        type="search"
                        placeholder="Search for a song"
                    />
                    <SubmitButton>Search</SubmitButton>
                </div>
            </form>
            {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
            )}
            <ul className="flex flex-col gap-2">
                {results.map((song) => (
                    <li key={song.videoId}>
                        <form action={handleSelectSong}>
                            <input
                                type="hidden"
                                name="videoId"
                                value={song.videoId}
                            />
                            <input
                                type="hidden"
                                name="title"
                                value={song.title}
                            />
                            <input
                                type="hidden"
                                name="artist"
                                value={song.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            />
                            <input
                                type="hidden"
                                name="duration"
                                value={song.duration_seconds}
                            />
                            <SubmitButton
                                variant="ghost"
                                className="flex h-auto w-full items-center justify-between gap-2 rounded-lg bg-gray-100 p-3 hover:cursor-pointer hover:bg-gray-200 active:bg-gray-200"
                            >
                                <span className="flex min-w-0 items-center gap-2">
                                    <ImageWithFallback
                                        src={`https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`}
                                        alt={`${song.title}`}
                                        width={40}
                                        height={40}
                                        className="rounded-sm object-cover"
                                        unoptimized
                                    />
                                    <span className="flex min-w-0 flex-col text-left">
                                        <span className="truncate text-sm font-semibold">
                                            {song.title}
                                        </span>
                                        <span className="truncate text-xs text-gray-500">
                                            {song.artists
                                                .map((artist) => artist.name)
                                                .join(", ")}
                                        </span>
                                    </span>
                                </span>
                                <PlusCircleIcon className="size-5 shrink-0 text-gray-500" />
                            </SubmitButton>
                        </form>
                    </li>
                ))}
            </ul>
        </div>
    )
}
