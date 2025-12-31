"use client"

import { api } from "@/convex/_generated/api"
import { useAuthedMutation } from "@/lib/auth"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
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
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { SubmitButton } from "../ui/submit-button"
import { APIPlaylist, PlaylistPicker } from "./playlist-picker"

export function CreateRoom({ children }: { children?: React.ReactNode }) {
    const [playlist, setPlaylist] = useState<APIPlaylist | null>(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    // @ts-ignore 
    const createRoom = useAuthedMutation(api.rooms.manage.createRoom)
    // @ts-ignore 
    const setRoomPlaylist = useAuthedMutation(api.rooms.setRoomPlaylist)

    async function handleCreateRoom(formData: FormData) {
        setLoading(true)
        try {
            const roomData = await createRoom({
                maxSongsPerUser: Number(formData.get("maxSongsPerUser")),
                fallbackSongs: playlist
                    ? playlist.tracks.map((track) => ({
                        videoId: track.videoId,
                        title: track.title,
                        artist: track.artists[0].name,
                        duration: track.duration_seconds,
                    }))
                    : undefined,
            })

            const res = await fetch (
                `/fastapi/rooms/${roomData.roomId}/playlist`, 
                {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true", 
                    },
                    body: JSON.stringify({ }),
                }
            )
        
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to create playlist");
            } else {
                const { playlistId } = await res.json()
                await setRoomPlaylist({
                    playlistId: playlistId,
                    roomId: roomData.roomId,
                })
            }

            toast.success("Room created")
            posthog.capture("room_created", {
                id: roomData.roomId,
                code: roomData.code,
                maxSongsPerUser: formData.get("maxSongsPerUser"),
                fallbackPlaylist: playlist && {
                    id: playlist.id,
                    title: playlist.title,
                    author: playlist.author.name,
                    description: playlist?.description,
                    trackCount: playlist.trackCount,
                },
            })
                
            router.push(`/host/${roomData.code}`)
        } catch (err: any) {
            toast.error(err.message || "Failed to create room")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        <PlusIcon className="size-4" /> Create Room
                    </Button>
                )}
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
