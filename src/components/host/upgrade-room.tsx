"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAuthActions } from "@convex-dev/auth/react"
import { useAction, useQuery } from "convex/react"
import { ArrowBigUpDashIcon, CheckIcon, SparklesIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"

const PRO_FEATURES = [
    "Unlimited guests",
    "Fallback playlist (unlimited songs)",
    "Advanced queue controls",
    "Control the room from your mobile device",
    "Expires after 7 days (up from 48 hours)",
]

export function UpgradeRoom({
    children,
    roomId,
}: {
    children: React.ReactNode
    roomId: Id<"rooms">
}) {
    const createCheckout = useAction(api.stripe.createPaymentCheckout)

    const { signIn } = useAuthActions()
    const user = useQuery(api.auth.getCurrentUser)

    const [loading, setLoading] = useState(false)

    async function handleRedirectToProCheckout(roomId: Id<"rooms">) {
        setLoading(true)
        // If the user is not signed in, sign them in and redirect to the pay page
        if (!user?._id || user.isAnonymous) {
            await signIn("google", { redirectTo: `/pay?roomId=${roomId}` })
            return
        }
        const checkout = await createCheckout({
            priceId: process.env.NEXT_PUBLIC_STRIPE_ROOM_PRICE!,
            roomId,
        })
        if (checkout?.url) {
            toast.success("Redirecting to checkout")
            redirect(checkout.url)
        } else {
            toast.error("Something went wrong while redirecting to checkout")
        }
        setLoading(false)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upgrade Room</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Upgrade your room to get extra features!
                </DialogDescription>

                <div className="border-primary/20 flex flex-col gap-3 rounded-lg border p-4 transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="size-4 text-amber-500" />
                            <span className="font-medium">Pro</span>
                        </div>
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
                            <li key={f} className="flex items-center gap-2">
                                <CheckIcon className="size-3.5 shrink-0 text-amber-500" />
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>

                <DialogFooter>
                    <Button
                        loading={loading}
                        className="w-full"
                        onClick={() => handleRedirectToProCheckout(roomId)}
                    >
                        <ArrowBigUpDashIcon
                            className="size-4"
                            data-icon="inline-start"
                        />
                        Upgrade
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
