"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAuthedMutation } from "@/lib/auth"
import { useAction } from "convex/react"
import { PlusIcon } from "lucide-react"
import { redirect, useRouter } from "next/navigation"
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
import { Switch } from "../ui/switch"
import { APIPlaylist, PlaylistPicker } from "./playlist-picker"

export function CreateRoomForm({ children }: { children?: React.ReactNode }) {
    const [playlist, setPlaylist] = useState<APIPlaylist | null>(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const createRoom = useAuthedMutation(api.rooms.manage.createRoom)

    const createCheckout = useAction(api.stripe.createPaymentCheckout)

    async function handleCreateRoom(formData: FormData) {
        await createRoom({
            pro: formData.get("pro") === "on",
            maxSongsPerUser: Number(formData.get("maxSongsPerUser")),
            fallbackSongs: playlist
                ? playlist.tracks.map((track) => ({
                      videoId: track.videoId,
                      title: track.title,
                      artist: track.artists[0].name,
                      duration: track.duration_seconds,
                  }))
                : undefined,
        }).then(async (data) => {
            posthog.capture("room_created", {
                id: data.roomId,
                code: data.code,
                maxSongsPerUser: formData.get("maxSongsPerUser"),
                fallbackPlaylist: playlist && {
                    id: playlist.id,
                    title: playlist.title,
                    author: playlist.author.name,
                    description: playlist?.description,
                    trackCount: playlist.trackCount,
                },
            })

            if (formData.get("pro") === "on") {
                const checkout = await createCheckout({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_ROOM_PRICE!,
                    roomId: data.roomId as Id<"rooms">,
                })
                if (checkout?.url) {
                    toast.success("Redirecting to checkout")
                    redirect(checkout.url)
                } else {
                    toast.error(
                        "Something went wrong while redirecting to checkout",
                    )
                }
            } else {
                toast.success("Room created")
                router.push(`/host/${data.code}`)
            }
        })
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
                    <div className="flex items-center gap-2">
                        <Switch id="pro" name="pro" />
                        <Label htmlFor="pro">Pro room (5€)</Label>
                    </div>
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
                    <SubmitButton size="lg" disabled={loading}>
                        Create Room
                    </SubmitButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}
