"use client"

import { SearchPlaylist } from "@/components/host/search-playlist"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { useAuthedMutation } from "@/lib/auth"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ManageRooms({
    preloadedRooms,
}: {
    preloadedRooms: Preloaded<typeof api.rooms.manage.listOwnRooms>
}) {
    const router = useRouter()
    const rooms = usePreloadedQuery(preloadedRooms)

    const createRoom = useAuthedMutation(api.rooms.manage.createRoom)

    async function handleCreateRoom() {
        createRoom({ maxSongsPerUser: 2 }).then((data) => {
            toast.success("Room created")
            router.push(`/host/${data.code}`)
        })
    }

    return (
        <div>
            <h1>Host</h1>
            <pre>{JSON.stringify(rooms, null, 2)}</pre>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Create Room</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Room</DialogTitle>
                    </DialogHeader>
                    <SearchPlaylist onSelect={handleCreateRoom} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
