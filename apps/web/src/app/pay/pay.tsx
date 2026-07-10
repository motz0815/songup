"use client"

import { api } from "@songup/backend/convex/_generated/api"
import type { Id } from "@songup/backend/convex/_generated/dataModel"
import { useAction } from "convex/react"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function PayClient({
    roomId,
    successUrl,
    cancelUrl,
}: {
    roomId: Id<"rooms">
    successUrl?: string
    cancelUrl?: string
}) {
    const createCheckout = useAction(api.stripe.createPaymentCheckout)

    useEffect(() => {
        async function handleCreateCheckout() {
            const checkout = await createCheckout({
                priceId: process.env.NEXT_PUBLIC_STRIPE_ROOM_PRICE!,
                roomId,
                successUrl,
                cancelUrl,
            })
            if (checkout?.url) {
                toast.success("Redirecting to checkout")
                redirect(checkout.url)
            } else {
                toast.error(
                    "Something went wrong while redirecting to checkout",
                )
                redirect("/host")
            }
        }

        void handleCreateCheckout()
    }, [cancelUrl, createCheckout, roomId, successUrl])

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-2">
            <Loader2 className="size-10 animate-spin" />
            <h1 className="text-2xl font-bold">
                You&apos;re being redirected to checkout...
            </h1>
        </div>
    )
}
