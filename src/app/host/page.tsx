import { api } from "@/convex/_generated/api"
import { preloadQuery } from "convex/nextjs"
import ManageRooms from "./manage"

export default async function ManageRoomsPage() {
    const preloadedRooms = await preloadQuery(api.rooms.manage.listOwnRooms)

    return <ManageRooms preloadedRooms={preloadedRooms} />
}
