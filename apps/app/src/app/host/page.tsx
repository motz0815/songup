import { Metadata } from "next"
import ManageRooms from "./manage"

export const metadata: Metadata = {
    title: "Manage rooms",
}

export default function ManageRoomsPage() {
    // Render the route shell immediately. Waiting for this query on the server
    // can leave the entire multi-zone navigation open when Convex is slow or
    // temporarily unavailable; the authenticated client provider subscribes
    // after hydration instead.
    return <ManageRooms />
}
