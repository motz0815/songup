"use client"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@songup/ui/components/hover-card"
import { formatDistance } from "date-fns"
import { useEffect, useState } from "react"

export function RoomExpiry({
    createdAt,
    expiresAt,
}: {
    createdAt: number
    expiresAt: number
}) {
    const [now, setNow] = useState<number | null>(null)

    useEffect(() => {
        const updateNow = () => setNow(Date.now())
        const initialTimeout = window.setTimeout(updateNow, 0)
        const interval = window.setInterval(updateNow, 60_000)

        return () => {
            window.clearTimeout(initialTimeout)
            window.clearInterval(interval)
        }
    }, [])

    return (
        <HoverCard>
            <HoverCardTrigger>
                Expires:{" "}
                <span
                    // If the room expires in less than 6 hours, make the text red
                    className={
                        now !== null && expiresAt - now < 6 * 60 * 60 * 1000
                            ? "text-red-500"
                            : ""
                    }
                >
                    {now === null
                        ? "…"
                        : formatDistance(new Date(expiresAt), now, {
                              addSuffix: true,
                          })}
                </span>
            </HoverCardTrigger>
            <HoverCardContent
                align="start"
                className="text-muted-foreground flex flex-col text-sm"
            >
                <p>Created: {new Date(createdAt).toLocaleString()}</p>
                <p>Expires: {new Date(expiresAt).toLocaleString()}</p>
            </HoverCardContent>
        </HoverCard>
    )
}
