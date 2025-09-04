import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import ManageRooms from "./manage"

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
