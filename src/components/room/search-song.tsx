"use client"

import { PlusCircleIcon } from "lucide-react"
import { useState } from "react"
import { ImageWithFallback } from "../image-with-fallback"
import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"

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

    async function handleAddSong(formData: FormData) {
        const song = {
            videoId: formData.get("videoId") as string,
            title: formData.get("title") as string,
            artist: formData.get("artist") as string,
            duration: Number(formData.get("duration")),
        }

        try {
            await onSelect(song)
        } catch (error) {
            setError("Failed to add song. Please try again.")
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
                        <form
                            action={handleAddSong}
                            className="flex items-center justify-between rounded-lg bg-gray-100 p-2"
                        >
                            <div className="flex items-center space-x-2">
                                <ImageWithFallback
                                    src={`https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`}
                                    alt={`${song.title}`}
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover"
                                    unoptimized
                                />
                                <div className="text-left">
                                    <p className="text-sm font-semibold">
                                        {song.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {song.artists
                                            .map((artist) => artist.name)
                                            .join(", ")}
                                    </p>
                                </div>
                            </div>
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
                            <SubmitButton size="sm">
                                <PlusCircleIcon className="h-4 w-4" />
                            </SubmitButton>
                        </form>
                    </li>
                ))}
            </ul>
        </div>
    )
}
