"use client"

import { api } from "@/convex/_generated/api"
import {
    DEFAULT_SKIP_THRESHOLD,
    MAX_SKIP_THRESHOLD,
    MIN_SKIP_THRESHOLD,
} from "@/convex/settings"
import { useAuthedMutation } from "@/lib/auth"
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
import { SchedulerOption, SchedulerPicker } from "./scheduler-picker"

export function CreateRoom({ children }: { children?: React.ReactNode }) {
    const [playlist, setPlaylist] = useState<APIPlaylist | null>(null)
    const [scheduler, setScheduler] = useState<SchedulerOption>("roundRobin")
    const [maxSongs, setMaxSongs] = useState(2)
    const [ratingsForget, setRatingsForget] = useState(false)
    const [ratingsForgetCount, setRatingsForgetCount] = useState(5)
    const [skipPercent, setSkipPercent] = useState(
        Math.round(DEFAULT_SKIP_THRESHOLD * 100),
    )
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    // @ts-ignore
    const createRoom = useAuthedMutation(api.rooms.manage.createRoom)
    // @ts-ignore
    const setRoomPlaylist = useAuthedMutation(api.rooms.setRoomPlaylist)

    async function handleCreateRoom() {
        setLoading(true)
        try {
            const roomData = await createRoom({
                maxSongsPerUser: maxSongs,
                scheduler: scheduler,
                numSongsToForget: ratingsForget ? ratingsForgetCount : -1,
                skipThreshold: skipPercent / 100,
                fallbackSongs: playlist
                    ? playlist.tracks.map((track) => ({
                          videoId: track.videoId,
                          title: track.title,
                          artist: track.artists[0].name,
                          duration: track.duration_seconds,
                      }))
                    : undefined,
            })

            // The history playlist is a nice-to-have. If YouTube Music refuses
            // to create one, the room should still open.
            try {
                const res = await fetch(
                    `/api/rooms/${roomData.roomId}/playlist`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "ngrok-skip-browser-warning": "true",
                        },
                        body: JSON.stringify({}),
                    },
                )

                if (res.ok) {
                    const { playlistId } = await res.json()
                    await setRoomPlaylist({
                        playlistId: playlistId,
                        roomId: roomData.roomId,
                    })
                } else {
                    toast.warning(
                        "Room created, but the history playlist couldn't be set up.",
                    )
                }
            } catch (playlistError) {
                console.error(playlistError)
                toast.warning(
                    "Room created, but the history playlist couldn't be set up.",
                )
            }

            posthog.capture("room_created", {
                id: roomData.roomId,
                code: roomData.code,
                maxSongsPerUser: maxSongs,
                scheduler,
                skipThreshold: skipPercent / 100,
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
            toast.error(err.message || "Couldn't create the room")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children ?? <Button>Create Room</Button>}
            </DialogTrigger>
            <DialogContent className="paper-field border-ink max-h-[85vh] overflow-y-auto rounded-none border-2 sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="font-display text-4xl font-extrabold tracking-[-0.05em]">
                        Create a room
                    </DialogTitle>
                </DialogHeader>

                <form
                    action={handleCreateRoom}
                    className="flex w-full flex-col gap-6"
                >
                    <SchedulerPicker
                        value={scheduler}
                        onChange={setScheduler}
                    />

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="maxSongs">
                            {scheduler === "FCFS"
                                ? "Max songs per person"
                                : "Max songs waiting per person"}
                        </Label>
                        <Input
                            id="maxSongs"
                            type="number"
                            min={1}
                            max={50}
                            value={maxSongs}
                            onChange={(e) =>
                                setMaxSongs(Number(e.target.value))
                            }
                        />
                    </div>

                    {scheduler === "weighted" && (
                        <div className="border-ink flex flex-col gap-3 border-y-2 py-3">
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    checked={ratingsForget}
                                    onChange={(e) =>
                                        setRatingsForget(e.target.checked)
                                    }
                                    className="accent-primary size-4"
                                />
                                Let ratings fade
                            </label>
                            <p className="text-muted-foreground text-xs">
                                {ratingsForget
                                    ? `Only each person's last ${ratingsForgetCount} played songs count towards their rating.`
                                    : "Every song a person has played counts towards their rating, all night."}
                            </p>
                            {ratingsForget && (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="ratingsForgetCount">
                                        Songs remembered
                                    </Label>
                                    <Input
                                        id="ratingsForgetCount"
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={ratingsForgetCount}
                                        onChange={(e) =>
                                            setRatingsForgetCount(
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="skipThreshold">
                            Votes needed to skip a song
                        </Label>
                        <input
                            id="skipThreshold"
                            type="range"
                            min={MIN_SKIP_THRESHOLD * 100}
                            max={MAX_SKIP_THRESHOLD * 100}
                            step={5}
                            value={skipPercent}
                            onChange={(e) =>
                                setSkipPercent(Number(e.target.value))
                            }
                            className="accent-primary w-full"
                        />
                        <p className="text-muted-foreground text-xs">
                            <span className="font-medium tabular-nums">
                                {skipPercent}%
                            </span>{" "}
                            of the people in the room. With 8 listening, that
                            takes{" "}
                            <span className="font-medium tabular-nums">
                                {Math.max(
                                    1,
                                    Math.ceil(8 * (skipPercent / 100)),
                                )}
                            </span>{" "}
                            votes.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fallbackPlaylist">
                            Fallback playlist
                        </Label>
                        <p className="text-muted-foreground text-xs">
                            Plays whenever nobody has queued anything.
                        </p>
                        <PlaylistPicker
                            id="fallbackPlaylist"
                            value={playlist}
                            onChange={setPlaylist}
                            onLoadingChange={() => {}}
                        />
                    </div>

                    <SubmitButton
                        disabled={loading}
                        className="border-ink bg-signal hover:bg-signal/90 h-12 rounded-none border-2 font-bold text-white"
                    >
                        Create room
                    </SubmitButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}
