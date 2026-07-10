import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@songup/backend/convex/_generated/api"
import type { Id } from "@songup/backend/convex/_generated/dataModel"
import { fetchQuery } from "convex/nextjs"
import { redirect } from "next/navigation"
import { PayClient } from "./pay"

export default async function PayPage({
    searchParams,
}: {
    searchParams: Promise<{
        roomId?: Id<"rooms">
        successUrl?: string
        cancelUrl?: string
    }>
}) {
    const { roomId, successUrl, cancelUrl } = await searchParams
    if (!roomId) {
        redirect("/host")
    }

    const room = await fetchQuery(
        api.rooms.getRoom,
        {
            roomId,
        },
        {
            token: await convexAuthNextjsToken(),
        },
    )

    const user = await fetchQuery(
        api.auth.getCurrentUser,
        {},
        {
            token: await convexAuthNextjsToken(),
        },
    )

    if (!room || !user || user.isAnonymous || room.proStatus === "active") {
        redirect("/host")
    }

    return (
        <PayClient
            roomId={roomId}
            successUrl={successUrl}
            cancelUrl={cancelUrl}
        />
    )
}
