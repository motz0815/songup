"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"

export default function MainHost({
    preloadedRooms,
}: {
    preloadedRooms: Preloaded<typeof api.rooms.manage.listOwnRooms>
}) {
    const rooms = usePreloadedQuery(preloadedRooms)

    const createRoom = useMutation(api.rooms.manage.createRoom)

    return (
        <div>
            <h1>Host</h1>
            <pre>{JSON.stringify(rooms, null, 2)}</pre>
            <Button onClick={() => createRoom({ maxSongsPerUser: 2 })}>
                Create Room
            </Button>
        </div>
    )
}
