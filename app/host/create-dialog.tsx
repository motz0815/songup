import { RoomSettingsForm } from "@/components/host/room-settings"
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Dialog } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { createRoom } from "./actions"

export function CreateRoomDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Create Room
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Create Room</DialogTitle>
                <RoomSettingsForm action={createRoom} />
            </DialogContent>
        </Dialog>
    )
}
