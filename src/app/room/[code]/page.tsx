import { api } from "@/convex/_generated/api"
import { preloadedQueryResult, preloadQuery } from "convex/nextjs"
import { notFound } from "next/navigation"
import Room from "./room"

export async function generateMetadata(props: {
    params: Promise<{ code: string }>
}) {
    const params = await props.params
    return {
        title: "Room - " + params.code,
    }
}

export default async function RoomPage(props: {
    params: Promise<{ code: string }>
}) {
    const { code } = await props.params

    const preloadedRoom = await preloadQuery(api.rooms.getRoomByCode, {
        code,
    })

    const room = preloadedQueryResult(preloadedRoom)

    if (!room) {
        notFound()
    }

    return <Room roomId={room._id} preloadedRoom={preloadedRoom} />
}
