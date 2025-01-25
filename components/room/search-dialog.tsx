"use client"

import { PlusCircle, PlusCircleIcon, SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { ImageWithFallback } from "../ui/image-with-fallback"
import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"
import { searchSong, SongResult } from "./actions"

export function SearchSongDialog({
    open,
    setOpen,
    disableTrigger,
    addSong,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    disableTrigger?: boolean
    addSong: (song: SongResult) => void
}) {
    const formRef = useRef<HTMLFormElement>(null)
    const [searchResults, setSearchResults] = useState<SongResult[]>([])
    const [error, setError] = useState<string | null>(null)
    const [pendingAdds, setPendingAdds] = useState<Set<string>>(new Set())

    async function handleSearch(formData: FormData) {
        setError(null)
        try {
            const query = formData.get("query") as string
            if (!query?.trim()) return

            const results = await searchSong(query)
            setSearchResults(results)
        } catch (err) {
            setError("Failed to search songs. Please try again.")
            console.error(err)
        }
    }

    async function handleAddSong(song: SongResult) {
        try {
            setPendingAdds((prev) => new Set(prev).add(song.video_id))
            await addSong(song)
        } catch (error) {
            setError("Failed to add song. Please try again.")
        } finally {
            setPendingAdds((prev) => {
                const next = new Set(prev)
                next.delete(song.video_id)
                return next
            })
        }
    }

    // Reset form and results when dialog closes
    useEffect(() => {
        if (!open) {
            formRef.current?.reset()
            setSearchResults([])
            setError(null)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disableTrigger} className="w-full sm:w-auto">
                    <PlusCircle />
                    Add a Song
                </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-3xl">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Add a Song</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                    <div className="grid gap-4 py-4">
                        <form
                            ref={formRef}
                            action={handleSearch}
                            className="mx-4"
                        >
                            <div className="flex items-center gap-2">
                                <Input
                                    name="query"
                                    placeholder="Search for songs or artists..."
                                    className="w-full"
                                    required
                                    minLength={2}
                                />
                                <SubmitButton>
                                    <SearchIcon />
                                </SubmitButton>
                            </div>
                        </form>

                        {error && (
                            <p className="text-center text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        {searchResults.length > 0 ? (
                            <ul className="space-y-2">
                                {searchResults.map((song) => (
                                    <li
                                        key={song.video_id}
                                        className="flex items-center justify-between rounded-lg bg-gray-100 p-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <ImageWithFallback
                                                src={`https://i.ytimg.com/vi_webp/${song.video_id}/mqdefault.webp`}
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
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleAddSong(song)}
                                            size="sm"
                                            loading={pendingAdds.has(
                                                song.video_id,
                                            )}
                                        >
                                            <PlusCircleIcon className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
