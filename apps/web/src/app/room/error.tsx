"use client"

import { JoinRoomForm } from "@/components/room/join-room"
import { Button } from "@songup/ui/components/button"
import { HomeIcon, RotateCwIcon } from "lucide-react"
import Link from "next/link"

export default function RoomError({ reset }: { reset: () => void }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2">
            <h1 className="text-4xl font-bold">Something went wrong</h1>
            <p className="text-lg">
                This room is no longer available. It may have expired.
            </p>
            <Button onClick={reset}>
                <RotateCwIcon className="size-4" /> Try again
            </Button>
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
