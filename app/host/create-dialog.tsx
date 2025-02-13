import { RoomSettingsForm } from "@/components/host/room-settings"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
