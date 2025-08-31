"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import { redirect } from "next/navigation"

export default function MainHost({
    preloadedRooms,
}: {
    preloadedRooms: Preloaded<typeof api.rooms.manage.listOwnRooms>
}) {
    const rooms = usePreloadedQuery(preloadedRooms)

    const createRoom = useMutation(api.rooms.manage.createRoom)

    function handleCreateRoom() {
        createRoom({ maxSongsPerUser: 2 }).then((data) => {
            redirect(`/host/${data.code}`)
        })
    }

    return (
        <div>
            <h1>Host</h1>
            <pre>{JSON.stringify(rooms, null, 2)}</pre>
            <Button onClick={handleCreateRoom}>Create Room</Button>
        </div>
    )
}
