"use client"

import { api } from "@songup/backend/convex/_generated/api"
import type { Id } from "@songup/backend/convex/_generated/dataModel"
import { Button } from "@songup/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@songup/ui/components/dialog"
import { useMutation } from "convex/react"
import { PlusIcon } from "lucide-react"
import posthog from "posthog-js"
import { useState } from "react"
import { toast } from "sonner"
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
        try {
            await addSong({
                roomId,
                videoId: song.videoId,
                title: song.title,
                artist: song.artist,
                duration: song.duration,
            })
        } catch {
            toast.error("Couldn't add song", {
                description: `${song.title} is already in the room.`,
            })
            return
        }
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
