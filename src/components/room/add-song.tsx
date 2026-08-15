"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { PlusIcon } from "lucide-react"
import posthog from "posthog-js"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { SearchSong } from "./search-song"

export function AddSong({
    disabled = false,
    roomId,
    inline = false,
    prominent = false,
}: {
    disabled?: boolean
    roomId: Id<"rooms">
    inline?: boolean
    prominent?: boolean
}) {
    const addSong = useMutation(api.rooms.addSong)
    const [open, setOpen] = useState(false)

    async function handleSelect(song: {
        videoId: string
        title: string
        artist: string
        duration: number
    }) {
        await addSong({
            roomId,
            videoId: song.videoId,
            title: song.title,
            artist: song.artist,
            duration: song.duration,
        })
        setOpen(false)
        toast.success("Song added", {
            description: `${song.title} by ${song.artist}`,
        })
        posthog.capture("song_added", {
            roomId,
            songId: song.videoId,
            songTitle: song.title,
            songArtist: song.artist,
            songDuration: song.duration,
        })
    }

    if (inline) {
        return (
            <div className="border-ink border-y-2 py-5">
                <SearchSong onSelect={handleSelect} disabled={disabled} />
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={disabled}
                    className={
                        prominent
                            ? "border-ink bg-signal hover:bg-signal/90 h-12 rounded-none border-2 px-6 font-bold text-white"
                            : "rounded-none font-bold"
                    }
                >
                    <PlusIcon /> Add a song
                </Button>
            </DialogTrigger>
            <DialogContent className="paper-field border-ink rounded-none border-2 sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="font-display text-3xl font-extrabold tracking-[-0.04em]">
                        Add a song
                    </DialogTitle>
                </DialogHeader>
                <SearchSong onSelect={handleSelect} />
            </DialogContent>
        </Dialog>
    )
}
