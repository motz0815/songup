"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { getURL } from "@/lib/utils"
import { useAction } from "convex/react"
import { ArrowBigUpDashIcon, XIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"

export function ProUpsell({
    roomId,
    roomCode,
}: {
    roomId: Id<"rooms">
    roomCode: string
}) {
    const [dismissed, setDismissed] = useState(false)
    const createCheckout = useAction(api.stripe.createPaymentCheckout)

    async function handleRedirectToProCheckout() {
        const checkout = await createCheckout({
            priceId: process.env.NEXT_PUBLIC_STRIPE_ROOM_PRICE!,
            roomId,
            successUrl: getURL(`/room/${roomCode}?success=true`),
            cancelUrl: getURL(`/room/${roomCode}?canceled=true`),
        })
        if (checkout?.url) {
            toast.success("Redirecting to checkout")
            redirect(checkout.url)
        } else {
            toast.error("Something went wrong while redirecting to checkout")
        }
    }

    return (
        <>
            {dismissed ? null : (
                <section className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Host controls</h2>
                    <div className="relative flex flex-col gap-2 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                                setDismissed(true)
                            }}
                        >
                            <XIcon />
                        </Button>
                        <p className="mr-6">
                            Want to control the room from here?{" "}
                        </p>
                        <Button onClick={handleRedirectToProCheckout}>
                            <ArrowBigUpDashIcon data-icon="inline-start" />
                            Upgrade to Pro
                        </Button>
                    </div>
                </section>
            )}
        </>
    )
}
