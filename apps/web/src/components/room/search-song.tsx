"use client"

import { Input } from "@songup/ui/components/input"
import { SubmitButton } from "@songup/ui/components/submit-button"
import { PlusCircleIcon } from "lucide-react"
import posthog from "posthog-js"
import { useState } from "react"
import { ImageWithFallback } from "../image-with-fallback"

const SEARCH_TIMEOUT_MS = 10000

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
        const query = formData.get("query") as string
        posthog.capture("song_searched", { query })
        try {
            setError(null)
            const res = await fetch(
                `/flask/search?query=${encodeURIComponent(query)}`,
                { signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS) },
            )
            if (!res.ok) {
                throw new Error(`Search failed with status ${res.status}`)
            }
            const data = await res.json()
            // Guard against a malformed body so the render never reads a
            // missing artists array.
            setResults(
                (Array.isArray(data) ? data : []).map((song) => ({
                    ...song,
                    artists: Array.isArray(song.artists) ? song.artists : [],
                })),
            )
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
                        <form
                            action={handleSelectSong}
                            className="flex items-center justify-between rounded-lg bg-gray-100 p-2"
                        >
                            <div className="flex items-center space-x-2">
                                <ImageWithFallback
                                    src={`https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`}
                                    alt={`${song.title}`}
                                    width={40}
                                    height={40}
                                    className="rounded-sm object-cover"
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
                            <SubmitButton size="icon">
                                <PlusCircleIcon className="size-4" />
                            </SubmitButton>
                        </form>
                    </li>
                ))}
            </ul>
        </div>
    )
}
