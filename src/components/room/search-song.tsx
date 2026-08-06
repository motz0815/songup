"use client"

import { formatDuration } from "@/lib/utils"
import { PlusCircleIcon, SearchXIcon } from "lucide-react"
import { useState } from "react"
import { ImageWithFallback } from "../image-with-fallback"
import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"

type SearchResult = {
    videoId: string
    title: string
    artists: { name: string }[]
    duration_seconds: number
}

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
    const [results, setResults] = useState<SearchResult[]>([])
    const [error, setError] = useState<string | null>(null)
    const [searched, setSearched] = useState(false)

    async function handleSearch(formData: FormData) {
        const query = (formData.get("query") as string)?.trim()
        if (!query) return

        setError(null)
        setSearched(true)

        try {
            const response = await fetch(
                `/api/search?query=${encodeURIComponent(query)}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                },
            )
            const body = await response.json()

            // The API answers with `{ error }` on failure, so anything that
            // isn't an array would blow up the list below.
            if (!response.ok || !Array.isArray(body)) {
                setResults([])
                setError(
                    typeof body?.error === "string"
                        ? body.error
                        : "Failed to search for songs. Please try again.",
                )
                return
            }

            setResults(body)
        } catch (error) {
            setResults([])
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
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to add that song. Please try again.",
            )
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
                        autoComplete="off"
                    />
                    <SubmitButton>Search</SubmitButton>
                </div>
            </form>
            {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
            )}
            {searched && !error && results.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                    <SearchXIcon className="size-6" />
                    <p className="text-sm">
                        Nothing playable found. Try a different search.
                    </p>
                </div>
            )}
            <ul className="flex flex-col gap-2">
                {results.map((song) => {
                    const artist = song.artists
                        .map((artist) => artist.name)
                        .join(", ")

                    return (
                        <li key={song.videoId}>
                            <form
                                action={handleSelectSong}
                                className="flex items-center justify-between gap-3 rounded-lg bg-muted p-2 transition-colors hover:bg-muted/70"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <ImageWithFallback
                                        src={`https://i.ytimg.com/vi_webp/${song.videoId}/mqdefault.webp`}
                                        alt={`${song.title}`}
                                        width={64}
                                        height={36}
                                        className="aspect-video w-16 shrink-0 rounded-sm object-cover"
                                        unoptimized
                                    />
                                    <div className="min-w-0 text-left">
                                        <p className="truncate text-sm font-semibold">
                                            {song.title}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {artist} &middot;{" "}
                                            {formatDuration(
                                                song.duration_seconds,
                                            )}
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
                                    value={artist}
                                />
                                <input
                                    type="hidden"
                                    name="duration"
                                    value={song.duration_seconds}
                                />
                                <SubmitButton size="sm" aria-label="Add song">
                                    <PlusCircleIcon className="size-4" />
                                </SubmitButton>
                            </form>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
