import { api } from "@/convex/_generated/api"
import { createAuth } from "@/lib/auth"
import { getToken } from "@convex-dev/better-auth/nextjs"
import { fetchQuery, preloadedQueryResult, preloadQuery } from "convex/nextjs"
import { notFound } from "next/navigation"
import Host from "./host"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ code: string }>
}) {
    const { code } = await params

    return {
        title: `Host - ${code}`,
    }
}

export default async function HostPage({
    params,
}: {
    params: Promise<{ code: string }>
}) {
    const { code } = await params

    /*
     * AUTHORIZATION
     */
    // Check if room exists and that the user is the host
    const preloadedRoom = await preloadQuery(api.rooms.getRoomByCode, {
        code,
    })

    const room = preloadedQueryResult(preloadedRoom)

    if (!room) {
        notFound()
    }

    const isHost = await fetchQuery(
        api.rooms.isHost,
        {
            roomId: room._id,
        },
        {
            token: await getToken(createAuth),
        },
    )

    if (!isHost) {
        notFound()
    }

    return <Host roomId={room._id} preloadedRoom={preloadedRoom} />
}
