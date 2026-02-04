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

type SchedulerOption = "FCFS" | "roundRobin" | "weighted"

export function CreateRoom({ children }: { children?: React.ReactNode }) {
    const [playlist, setPlaylist] = useState<APIPlaylist | null>(null)
    const [scheduler, setScheduler] = useState<SchedulerOption>("FCFS")
    const [maxSongs, setMaxSongs] = useState(2)
    const [ratingsForget, setRatingsForget] = useState(false)
    const [ratingsForgetCount, setRatingsForgetCount] = useState(5)
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
                maxSongsPerUser: maxSongs,
                scheduler: scheduler,
                numSongsToForget: (ratingsForget) ? ratingsForgetCount : -1,
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
                `/api/rooms/${roomData.roomId}/playlist`, 
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
                {/* Scheduler select */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="scheduler">Scheduler</Label>
                    <select
                    id="scheduler"
                    className="rounded border px-2 py-1"
                    value={scheduler}
                    onChange={e => setScheduler(e.target.value as SchedulerOption)}
                    >
                    <option value="FCFS">FCFS</option>
                    <option value="roundRobin">Round Robin</option>
                    <option value="weighted">DemocraTune</option>
                    </select>
                </div>

                {/* Max songs / personal queue size */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="maxSongs">
                    {scheduler === "FCFS" ? "Max songs per user" : "Max size of personal queue"}
                    </Label>
                    <Input
                    id="maxSongs"
                    type="number"
                    min={1}
                    value={maxSongs}
                    onChange={e => setMaxSongs(Number(e.target.value))}
                    />
                </div>

                {/* Additional DemocraTune options */}
                {scheduler === "weighted" && (
                    <div className="flex flex-col gap-2">
                    <Label htmlFor="ratingsForget">Can ratings be forgotten?</Label>
                    <input
                        type="checkbox"
                        id="ratingsForget"
                        checked={ratingsForget}
                        onChange={e => setRatingsForget(e.target.checked)}
                    />

                    {ratingsForget && (
                        <div className="flex flex-col gap-2">
                        <Label htmlFor="ratingsForgetCount">Number of songs after which ratings are forgotten</Label>
                        <Input
                            id="ratingsForgetCount"
                            type="number"
                            min={1}
                            value={ratingsForgetCount}
                            onChange={e => setRatingsForgetCount(Number(e.target.value))}
                        />
                        </div>
                    )}
                    </div>
                )}

                {/* Fallback playlist picker */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="fallbackPlaylist">Fallback playlist</Label>
                    <PlaylistPicker
                    id="fallbackPlaylist"
                    value={playlist}
                    onChange={setPlaylist}
                    onLoadingChange={() => {}}
                    />
                </div>

                <SubmitButton disabled={loading}>Create Room</SubmitButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}
