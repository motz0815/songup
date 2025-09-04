"use client"

import { api } from "@/convex/_generated/api"
import { useAuthedMutation } from "@/lib/auth"
import { useRouter } from "next/navigation"
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
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { SubmitButton } from "../ui/submit-button"
import { APIPlaylist, PlaylistPicker } from "./playlist-picker"

export function CreateRoom() {
    const [playlist, setPlaylist] = useState<APIPlaylist | null>(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const createRoom = useAuthedMutation(api.rooms.manage.createRoom)

    async function handleCreateRoom(formData: FormData) {
        await createRoom({
            maxSongsPerUser: Number(formData.get("maxSongsPerUser")),
            fallbackSongs: playlist
                ? playlist.tracks.map((track) => ({
                      videoId: track.videoId,
                      title: track.title,
                      artist: track.artists[0].name,
                      duration: track.duration_seconds,
                  }))
                : undefined,
        }).then((data) => {
            toast.success("Room created")
            router.push(`/host/${data.code}`)
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Room</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Room</DialogTitle>
                </DialogHeader>
                <form
                    action={handleCreateRoom}
                    className="flex w-full flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="maxSongsPerUser">
                            Max songs per user
                        </Label>
                        <Input
                            id="maxSongsPerUser"
                            name="maxSongsPerUser"
                            defaultValue="2"
                            min="1"
                            required
                            type="number"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fallbackPlaylist">
                            Select a fallback playlist
                        </Label>
                        <PlaylistPicker
                            id="fallbackPlaylist"
                            value={playlist}
                            onLoadingChange={setLoading}
                            onChange={setPlaylist}
                        />
                    </div>
                    <SubmitButton disabled={loading}>Create Room</SubmitButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}
