import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import { Metadata } from "next"
import ManageRooms from "./manage"

export const metadata: Metadata = {
    title: "Manage rooms",
}

export default async function ManageRoomsPage() {
    const preloadedRooms = await preloadQuery(
        api.rooms.manage.listOwnRooms,
        {},
        {
            token: await convexAuthNextjsToken(),
        },
    )

    return <ManageRooms preloadedRooms={preloadedRooms} />
}
