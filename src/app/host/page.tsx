import { api } from "@/convex/_generated/api"
import { preloadQuery } from "convex/nextjs"
import MainHost from "./main-host"

export default async function MainHostPage() {
    const preloadedRooms = await preloadQuery(api.rooms.manage.listOwnRooms)

    return <MainHost preloadedRooms={preloadedRooms} />
}
