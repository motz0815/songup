import { getSession } from "@/lib/session"
import { createClient } from "@/lib/supabase/client"
import { notFound } from "next/navigation"
import { RoomPage } from "./room"

export async function generateMetadata(props: {
    params: Promise<{ code: string }>
}) {
    const params = await props.params
    return {
        title: "Room - " + params.code,
    }
}

export default async function Page(props: {
    params: Promise<{ code: string }>
}) {
    const params = await props.params
    const session = await getSession()

    const supabase = createClient()

    const { data: room } = await supabase
        .from("rooms")
        .select()
        .eq("code", params.code)
        .single()

    if (!room) notFound()

    const { data: songs } = await supabase
        .from("songs")
        .select()
        .eq("room", room.id)
        .order("id")
        .gte("id", room.current_song)

    if (!songs) {
        console.error("Songs couldn't be fetched for room", room.id)
        return
    }

    return (
        <RoomPage
            room={room}
            songs={songs}
            user={{
                isLoggedIn: session.isLoggedIn,
                username: session.username,
                uuid: session.uuid,
            }}
        />
    )
}
