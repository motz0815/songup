"use client"

import { Button } from "@songup/ui/components/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import { useEffect } from "react"

export function RoomExpired({ surface }: { surface: "host" | "room" }) {
    useEffect(() => {
        posthog.capture("room_expired_shown", { surface })
    }, [surface])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-br from-slate-500 to-indigo-950 p-4 text-center text-white">
            <h1 className="text-4xl font-bold">This room has expired</h1>
            <p className="text-lg text-white/80">
                Rooms close automatically after they expire. Create a new room
                to keep the music going.
            </p>
            <Button asChild>
                <Link
                    href="/host"
                    onClick={() =>
                        posthog.capture("room_expired_create_clicked", {
                            surface,
                        })
                    }
                >
                    <PlusIcon className="size-4" /> Create a new room
                </Link>
            </Button>
        </div>
    )
}
