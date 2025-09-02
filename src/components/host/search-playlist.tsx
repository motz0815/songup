"use client"

import { CheckIcon } from "lucide-react"
import { useState } from "react"
import { ImageWithFallback } from "../image-with-fallback"
import { Button, ButtonProps } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"

export function SearchPlaylist({
    selected,
    onSelect,
    disabled = false,
    buttonVariant,
}: {
    selected: string
    onSelect: (playlist: {
        browseId: string
        title: string
        author: string
        itemCount: number
    }) => Promise<void>
    disabled?: boolean
    buttonVariant?: ButtonProps["variant"]
}) {
    const [results, setResults] = useState<
        {
            browseId: string
            title: string
            author: string
            itemCount: number
        }[]
    >([])
    const [error, setError] = useState<string | null>(null)

    async function handleSearch(formData: FormData) {
        try {
            const query = formData.get("query") as string
            setError(null)

            // Check if the query is a valid browseId
            if (query.startsWith("PL")) {
                try {
                    const playlist = await fetch(
                        `/flask/get-playlist-info?browseId=${encodeURIComponent(query)}`,
                    ).then((res) => res.json())
                    console.log(playlist)
                    if (playlist) {
                        await onSelect({
                            browseId: playlist.id,
                            title: playlist.title,
                            author: playlist.author,
                            itemCount: playlist.itemCount,
                        })
                        return
                    }
                } catch (error) {
                    // Silence the error, it's not a valid playlist
                }
            }

            const results: [] = await fetch(
                `/flask/search-playlist?query=${encodeURIComponent(query)}`,
            ).then((res) => res.json())
            setResults(results)
        } catch (error) {
            setError("Failed to search for playlists. Please try again.")
            console.error(error)
        }
    }

    async function handleSelectPlaylist(formData: FormData) {
        const playlist = {
            browseId: formData.get("browseId") as string,
            title: formData.get("title") as string,
            author: formData.get("author") as string,
            itemCount: Number(formData.get("itemCount")),
        }
        await onSelect(playlist)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={disabled} variant={buttonVariant}>
                    Search Playlist
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Search Playlists</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <form action={handleSearch}>
                        <div className="flex w-full gap-2">
                            <Input
                                name="query"
                                type="search"
                                placeholder="Search for a playlist or directly enter the browseId"
                            />
                            <SubmitButton>Search</SubmitButton>
                        </div>
                    </form>
                    {error && (
                        <p className="text-center text-sm text-red-500">
                            {error}
                        </p>
                    )}
                    <ul className="flex flex-col gap-2">
                        {results.map((playlist) => (
                            <li key={playlist.browseId}>
                                <form
                                    action={handleSelectPlaylist}
                                    className="flex items-center justify-between rounded-lg bg-gray-100 p-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <ImageWithFallback
                                            src={`https://i.ytimg.com/vi_webp/${playlist.browseId}/mqdefault.webp`}
                                            alt={`${playlist.title}`}
                                            width={40}
                                            height={40}
                                            className="rounded-md object-cover"
                                            unoptimized
                                        />
                                        <div className="text-left">
                                            <p className="text-sm font-semibold">
                                                {playlist.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {playlist.author}
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="browseId"
                                        value={playlist.browseId}
                                    />
                                    <input
                                        type="hidden"
                                        name="title"
                                        value={playlist.title}
                                    />
                                    <input
                                        type="hidden"
                                        name="artist"
                                        value={playlist.author}
                                    />
                                    <input
                                        type="hidden"
                                        name="itemCount"
                                        value={playlist.itemCount}
                                    />
                                    <SubmitButton size="sm">
                                        <CheckIcon className="size-4" />
                                    </SubmitButton>
                                </form>
                            </li>
                        ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    )
}
