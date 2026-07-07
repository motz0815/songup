import { JoinRoomForm } from "@/components/room/join-room"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2">
            <h1 className="text-4xl font-bold">Room not found</h1>
            <p className="text-lg">
                The room you are looking for does not exist.
            </p>
            <JoinRoomForm />
            <p className="text-sm text-gray-500">or</p>
            <Button asChild>
                <Link href="/">
                    <HomeIcon className="size-4" /> Go back to home
                </Link>
            </Button>
        </div>
    )
}
