"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useAuthActions } from "@convex-dev/auth/react"
import {
    Preloaded,
    useConvexAuth,
    useMutation,
    usePreloadedQuery,
} from "convex/react"
import { toast } from "sonner"

export default function MainHost({
    preloadedRooms,
}: {
    preloadedRooms: Preloaded<typeof api.rooms.manage.listOwnRooms>
}) {
    const rooms = usePreloadedQuery(preloadedRooms)

    const createRoom = useMutation(api.rooms.manage.createRoom)

    const { isAuthenticated } = useConvexAuth()
    const { signIn } = useAuthActions()

    async function handleCreateRoom() {
        if (!isAuthenticated) {
            await signIn("anonymous")
        }

        createRoom({ maxSongsPerUser: 2 }).then((data) => {
            toast.success("Room created")
            open(`/host/${data.code}`, "_blank")
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
