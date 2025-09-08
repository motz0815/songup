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
}: {
    disabled?: boolean
    roomId: Id<"rooms">
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled}>
                    <PlusIcon /> Add Song
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Song</DialogTitle>
                </DialogHeader>
                <SearchSong onSelect={handleSelect} />
            </DialogContent>
        </Dialog>
    )
}
