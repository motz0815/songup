"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"

export function Queue({ roomId }: { roomId: Id<"rooms"> }) {
    const queue = useQuery(api.rooms.getQueue, {
        roomId,
    })

    return <div>Queue</div>
}
