"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import {
    Preloaded,
    useConvexAuth,
    useMutation,
    usePreloadedQuery,
} from "convex/react"
import { redirect } from "next/navigation"
import { toast } from "sonner"

export default function ManageRooms({
    preloadedRooms,
}: {
    preloadedRooms: Preloaded<typeof api.rooms.manage.listOwnRooms>
}) {
    const rooms = usePreloadedQuery(preloadedRooms)

    const createRoom = useMutation(api.rooms.manage.createRoom)

    const { isAuthenticated } = useConvexAuth()

    async function handleCreateRoom() {
        createRoom({ maxSongsPerUser: 2 }).then((data) => {
            toast.success("Room created")
            redirect(`/host/${data.code}`)
        })
    }

    return (
        <div>
            <h1>Host</h1>
            <pre>{JSON.stringify(rooms, null, 2)}</pre>
            <Button disabled={!isAuthenticated} onClick={handleCreateRoom}>
                Create Room
            </Button>
        </div>
    )
}
