"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Music, Search } from "lucide-react"
import { useRef, useState } from "react"

export interface Playlist {
    id: string
    title: string
    author: string
}

export interface PlaylistPickerProps {
    onSelect: (playlist: Playlist | null) => void
    defaultValue?: Playlist | null
    placeholder?: string
    className?: string
}

export function PlaylistPicker({
    onSelect,
    defaultValue = null,
    placeholder = "Search for a playlist...",
    className = "",
}: PlaylistPickerProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Playlist[]>([])
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
        defaultValue,
    )
    const [error, setError] = useState<string | null>(null)
    const [hasSearched, setHasSearched] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Client-side action for searching playlists
    async function searchPlaylists(formData: FormData) {
        const searchQuery = formData.get("query") as string

        if (!searchQuery.trim()) {
            setResults([])
            setHasSearched(false)
            return
        }

        setError(null)
        setHasSearched(true)

        try {
            const response = await fetch(
                `/api/search/playlist?q=${encodeURIComponent(searchQuery.trim())}`,
            )

            if (!response.ok) {
                throw new Error("Failed to fetch playlists")
            }

            const data = await response.json()
            setResults(data.playlists || [])
        } catch (err) {
            setError("An error occurred while searching for playlists")
            console.error(err)
        }
    }

    const handleSelect = (playlist: Playlist) => {
        setSelectedPlaylist(playlist)
        onSelect(playlist)
        setQuery("")
        setResults([])
        setHasSearched(false)
    }

    const handleClear = () => {
        setSelectedPlaylist(null)
        onSelect(null)
        setQuery("")
        setResults([])
        setHasSearched(false)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {!selectedPlaylist ? (
                <div className="space-y-4">
                    <form action={searchPlaylists} className="flex gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                name="query"
                                placeholder={placeholder}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-9 pr-4"
                                aria-label="Search for a playlist"
                                ref={inputRef}
                            />
                        </div>
                        <SubmitButton>Search</SubmitButton>
                    </form>

                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="rounded-md border border-border">
                            <ul className="max-h-80 divide-y divide-border overflow-auto">
                                {results.map((playlist) => (
                                    <li
                                        key={playlist.id}
                                        className="p-2 hover:bg-muted"
                                    >
                                        <button
                                            onClick={() =>
                                                handleSelect(playlist)
                                            }
                                            className="flex w-full items-start gap-3 text-left"
                                        >
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-muted">
                                                <Music className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="truncate font-medium">
                                                    {playlist.title}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {playlist.author}
                                                </p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {hasSearched && results.length === 0 && (
                        <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                            No playlists found for "{query}"
                        </div>
                    )}
                </div>
            ) : (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            Selected Playlist
                        </CardTitle>
                        <CardDescription>
                            {selectedPlaylist.author}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="flex items-start gap-3">
                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-sm bg-muted">
                                <Music className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-medium">
                                    {selectedPlaylist.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    By {selectedPlaylist.author}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClear}
                        >
                            Change Playlist
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
