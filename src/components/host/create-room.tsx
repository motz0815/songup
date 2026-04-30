"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAuthedMutation } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useAction, useQuery } from "convex/react"
import {
    AlertCircleIcon,
    CheckIcon,
    PlusIcon,
    SparklesIcon,
    ZapIcon,
} from "lucide-react"
import { redirect, useRouter } from "next/navigation"
import posthog from "posthog-js"
import { useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { SubmitButton } from "../ui/submit-button"
import { APIPlaylist, PlaylistPicker } from "./playlist-picker"

const FREE_FEATURES = [
    "Unlimited guests",
    "Fallback playlist (up to 50 songs)",
    "Expires after 48 hours",
]

const PRO_FEATURES = [
    "Unlimited guests",
    "Fallback playlist (unlimited songs)",
    "Advanced queue controls",
    "Control the room from your mobile device",
    "Expires after 7 days",
]

export function CreateRoomForm({ children }: { children?: React.ReactNode }) {
    const [playlist, setPlaylist] = useState<APIPlaylist | null>(null)
    const [loading, setLoading] = useState(false)
    const [roomTier, setRoomTier] = useState<"free" | "pro">("free")
    const user = useQuery(api.auth.getCurrentUser)
    const isLoggedIn = !user?.isAnonymous && user

    const router = useRouter()

    const createRoom = useAuthedMutation(api.rooms.manage.createRoom)

    const createCheckout = useAction(api.stripe.createPaymentCheckout)

    async function handleCreateRoom(formData: FormData) {
        await createRoom({
            pro: formData.get("pro") === "pro",
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
            const pro = formData.get("pro") === "pro"
            posthog.capture("room_created", {
                id: data.roomId,
                code: data.code,
                pro,
                maxSongsPerUser: formData.get("maxSongsPerUser"),
                fallbackPlaylist: playlist && {
                    id: playlist.id,
                    title: playlist.title,
                    author: playlist.author.name,
                    description: playlist?.description,
                    trackCount: playlist.trackCount,
                },
            })

            if (pro) {
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
                    <input type="hidden" name="pro" value={roomTier} />
                    <div className="flex flex-col gap-2">
                        <Label>Room type</Label>
                        <RadioGroup
                            value={roomTier}
                            onValueChange={(v) =>
                                setRoomTier(v as "free" | "pro")
                            }
                            className="grid grid-cols-2 gap-3"
                        >
                            {/* Free tier */}
                            <label
                                htmlFor="tier-free"
                                className={cn(
                                    "flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors",
                                    roomTier === "free"
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50",
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <ZapIcon className="text-muted-foreground size-4" />
                                        <span className="font-medium">
                                            Free
                                        </span>
                                    </div>
                                    <RadioGroupItem
                                        value="free"
                                        id="tier-free"
                                    />
                                </div>
                                <p className="text-2xl font-bold">
                                    0$
                                    <span className="text-muted-foreground text-sm font-normal">
                                        {" "}
                                        / room
                                    </span>
                                </p>
                                <ul className="text-muted-foreground flex flex-col gap-1.5 text-sm">
                                    {FREE_FEATURES.map((f) => (
                                        <li
                                            key={f}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckIcon className="text-primary size-3.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </label>

                            {/* Pro tier */}
                            <label
                                htmlFor="tier-pro"
                                className={cn(
                                    "flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors",
                                    roomTier === "pro"
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50",
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <SparklesIcon className="size-4 text-amber-500" />
                                        <span className="font-medium">Pro</span>
                                    </div>
                                    <RadioGroupItem value="pro" id="tier-pro" />
                                </div>
                                <p className="text-2xl font-bold">
                                    5$
                                    <span className="text-muted-foreground text-sm font-normal">
                                        {" "}
                                        / room
                                    </span>
                                </p>
                                <ul className="text-muted-foreground flex flex-col gap-1.5 text-sm">
                                    {PRO_FEATURES.map((f) => (
                                        <li
                                            key={f}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckIcon className="size-3.5 shrink-0 text-amber-500" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </label>
                        </RadioGroup>
                    </div>
                    {roomTier === "pro" && !isLoggedIn && (
                        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                            <AlertCircleIcon />
                            <AlertTitle>
                                Sign in to create a Pro room
                            </AlertTitle>
                            <AlertDescription>
                                Please sign in before creating a Pro room
                            </AlertDescription>
                        </Alert>
                    )}
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
                    <SubmitButton
                        size="lg"
                        disabled={
                            loading || (roomTier === "pro" && !isLoggedIn)
                        }
                    >
                        Create Room
                    </SubmitButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}
