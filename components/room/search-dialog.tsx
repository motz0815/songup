"use client"

import { Loader2Icon, PlusCircleIcon, SearchIcon } from "lucide-react"
import { SetStateAction, useState } from "react"
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
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<SongResult[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    async function handleSearch() {
        setIsSearching(true)
        // API call
        const results = await searchSong(searchQuery)

        setSearchResults(results)

        setIsSearching(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disableTrigger} className="w-full sm:w-auto">
                    <PlusCircleIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Add a Song
                </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[80vh] w-full max-w-[95vw] flex-col sm:max-w-3xl">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Add a Song</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                    <div className="grid gap-4 py-4">
                        <div className="mx-4 flex flex-col items-center gap-2 space-y-2 sm:flex-row sm:space-y-0">
                            <Input
                                placeholder="Search for songs or artists..."
                                value={searchQuery}
                                onChange={(e: {
                                    target: {
                                        value: SetStateAction<string>
                                    }
                                }) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                            <Button
                                onClick={handleSearch}
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                <SearchIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        {isSearching ? (
                            <div className="flex justify-center">
                                <Loader2Icon className="h-8 w-8 animate-spin" />
                            </div>
                        ) : searchResults.length > 0 ? (
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
                                            />
                                            <div className="text-left">
                                                <p className="text-sm font-semibold">
                                                    {song.title}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => addSong(song)}
                                            size="sm"
                                        >
                                            <PlusCircleIcon className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : searchQuery && !isSearching ? (
                            <p className="text-sm">
                                No songs found. Please try a different search.
                            </p>
                        ) : null}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
