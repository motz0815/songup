import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@songup/backend/convex/_generated/api"
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
    // Check if room exists and that the user is the host.
    // The room preload and the auth token are independent, so fetch them
    // together to shorten the time the page blocks before it paints.
    const [preloadedRoom, token] = await Promise.all([
        preloadQuery(api.rooms.getRoomByCode, { code }),
        convexAuthNextjsToken(),
    ])

    const room = preloadedQueryResult(preloadedRoom)

    if (!room) {
        notFound()
    }

    const isHost = await fetchQuery(
        api.rooms.isHost,
        {
            roomId: room._id,
        },
        { token },
    )

    if (!isHost) {
        notFound()
    }

    return <Host roomId={room._id} preloadedRoom={preloadedRoom} />
}
