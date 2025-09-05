"use client"

import { cn } from "@/lib/utils"
import { ArrowLeftIcon, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ImageWithFallback } from "../image-with-fallback"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ScrollArea } from "../ui/scroll-area"
import { SubmitButton } from "../ui/submit-button"

// Return type from the API
export type APIPlaylist = {
    author: {
        name: string
    }
    description?: string
    id: string
    title: string
    thumbnails: {
        url: string
    }[]
    trackCount: number
    tracks: {
        videoId: string
        title: string
        artists: {
            name: string
        }[]
        duration_seconds: number
    }[]
}

type MoodPlaylist = {
    description: string
    playlistId: string
    thumbnails: {
        url: string
    }[]
    title: string
}

type Mood = {
    params: string
    title: string
}

export function PlaylistPicker({
    value,
    onChange,
    onLoadingChange,
    id,
}: {
    value: APIPlaylist | null
    onChange: (playlist: APIPlaylist | null) => void
    onLoadingChange: (loading: boolean) => void
    id: string
}) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [moods, setMoods] = useState<Mood[] | null>(null)
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [moodPlaylists, setMoodPlaylists] = useState<MoodPlaylist[] | null>(
        null,
    )

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded)
    }

    function handleSelectPlaylist(playlistId: string) {
        setOpen(false)
        setLoading(true)
        fetch(`/flask/get-playlist?playlistId=${playlistId}`)
            .then((res) => res.json())
            .then((data: APIPlaylist) => {
                onChange(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function handleCustomPlaylistSubmit(formData: FormData) {
        let playlistId = (formData.get("playlistId") as string).trim()
        console.log("Submitted playlistId", playlistId)

        // Trim away URL parts, if it's a URL
        try {
            const url = new URL(playlistId)
            playlistId = url.searchParams.get("list") ?? playlistId
        } catch (error) {
            // Ignore
        }

        console.log("Using playlistId", playlistId)

        handleSelectPlaylist(playlistId)
    }

    useEffect(() => {
        fetch("/flask/get-mood-categories")
            .then((res) => res.json())
            .then((data: Mood[]) => {
                setMoods(data)
            })
    }, [])

    useEffect(() => {
        if (selectedMood) {
            fetch(
                `/flask/get-mood-playlists?mood_category=${selectedMood.params}`,
            )
                .then((res) => res.json())
                .then((data: MoodPlaylist[]) => {
                    setMoodPlaylists(data)
                })
        } else {
            setMoodPlaylists(null)
        }
    }, [selectedMood])

    useEffect(() => {
        onLoadingChange(loading)
    }, [loading])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={loading} id={id}>
                <PlaylistCard playlist={value} loading={loading} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select a fallback playlist</DialogTitle>
                    <DialogDescription>
                        Songs added by users will always have priority over
                        fallback songs
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh]">
                    {selectedMood ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-baseline gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setSelectedMood(null)}
                                >
                                    <ArrowLeftIcon className="h-4 w-4" />
                                </Button>
                                <h3 className="text-lg font-semibold">
                                    {selectedMood.title}
                                </h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                {moodPlaylists &&
                                    moodPlaylists.map((playlist) => (
                                        <span key={playlist.playlistId}>
                                            <MoodPlaylistCard
                                                playlist={playlist}
                                                onClick={() =>
                                                    handleSelectPlaylist(
                                                        playlist.playlistId,
                                                    )
                                                }
                                            />
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {moods && (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Moods & moments
                                        </h3>

                                        <div className="flex flex-col gap-2">
                                            {(isExpanded
                                                ? moods
                                                : moods.slice(0, 5)
                                            ).map((mood) => (
                                                <div
                                                    key={mood.params}
                                                    className="hover:bg-secondary rounded-lg border p-3 shadow-sm transition-all hover:cursor-pointer"
                                                    onClick={() =>
                                                        setSelectedMood(mood)
                                                    }
                                                >
                                                    {mood.title}
                                                </div>
                                            ))}
                                            {moods.length > 5 && (
                                                <button
                                                    onClick={toggleExpansion}
                                                    className="hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg border border-dashed p-2 text-sm transition-all hover:cursor-pointer"
                                                >
                                                    {isExpanded
                                                        ? `Show less (${moods.length - 5} hidden)`
                                                        : `More (${moods.length - 5} more)`}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="mt-6">
                                <h3 className="mb-4 text-lg font-semibold">
                                    Or use your own playlist
                                </h3>
                                <form
                                    action={handleCustomPlaylistSubmit}
                                    className="flex flex-col gap-3"
                                >
                                    <div>
                                        <Label htmlFor="custom-playlist-id">
                                            Playlist ID or URL
                                        </Label>
                                        <Input
                                            id="custom-playlist-id"
                                            name="playlistId"
                                            type="text"
                                            placeholder="Paste YouTube playlist ID or URL here..."
                                            className="mt-1"
                                        />
                                    </div>
                                    <SubmitButton>
                                        Use This Playlist
                                    </SubmitButton>
                                </form>
                            </div>
                        </>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

function PlaylistCard({
    playlist,
    loading,
}: {
    playlist: APIPlaylist | null
    loading: boolean
}) {
    return (
        <div
            className={cn(
                "hover:bg-secondary flex items-center space-x-4 rounded-lg border p-2 shadow-sm transition-all hover:cursor-pointer",
                loading && "hover:bg-transparent",
            )}
        >
            {loading ? (
                <div className="flex w-full items-center justify-center">
                    <Loader2 className="size-5 animate-spin" />
                </div>
            ) : (
                <>
                    {playlist ? (
                        <div className="flex w-full items-center justify-between gap-2">
                            <ImageWithFallback
                                src={playlist.thumbnails[0].url}
                                width={128}
                                height={128}
                                alt={`${playlist.title}`}
                                className="size-16 rounded-lg border border-white/20 object-cover"
                            />
                            <div className="flex grow flex-col text-left">
                                <p className="text-lg font-semibold">
                                    {playlist.title}
                                </p>
                                <p className="text-muted-foreground max-w-[200px] overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                                    {playlist.author.name}
                                </p>
                            </div>
                            <div className="flex gap-2 text-right">
                                <p className="text-muted-foreground text-sm">
                                    {playlist.trackCount} songs
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="w-full text-center">
                            No playlist selected
                        </p>
                    )}
                </>
            )}
        </div>
    )
}

function MoodPlaylistCard({
    playlist,
    onClick,
}: {
    playlist: MoodPlaylist
    onClick: () => void
}) {
    return (
        <div
            className="hover:bg-secondary flex items-center gap-2 rounded-lg border p-2 shadow-sm transition-all hover:cursor-pointer"
            onClick={onClick}
        >
            <ImageWithFallback
                src={playlist.thumbnails[0].url}
                width={128}
                height={128}
                alt={playlist.title}
                className="size-16 rounded-lg border border-white/20 object-cover"
            />
            <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold">{playlist.title}</p>
                <p className="text-muted-foreground text-sm">
                    {playlist.description}
                </p>
            </div>
        </div>
    )
}
