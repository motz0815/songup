"use server"

import { getSession } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"

export async function updateCurrentSong(code: string, song_id: number) {
    // check if the user is the host
    const session = await getSession()
    if (!session.isLoggedIn) {
        return {
            ok: false,
            message: "You are not logged in",
        }
    }

    const supabase = createAdminClient()

    const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select()
        .eq("code", code ?? "")
        .single()

    if (roomError || !room) {
        return {
            ok: false,
            message: "Room not found",
        }
    }

    if (room.host !== session.uuid) {
        return {
            ok: false,
            message: "You are not the host",
        }
    }

    // update the current song
    const { error: songError } = await supabase
        .from("rooms")
        .update({ current_song: song_id })
        .eq("code", code ?? "")

    if (songError) {
        return {
            ok: false,
            message: "Failed to update current song",
        }
    }

    return {
        ok: true,
    }
}

export async function deleteSong(code: string, song_id: number) {
    // check if the user is the host
    const session = await getSession()
    if (!session.isLoggedIn) {
        return {
            ok: false,
            message: "You are not logged in",
        }
    }

    const supabase = createAdminClient()

    const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select()
        .eq("code", code ?? "")
        .single()

    if (roomError || !room) {
        return {
            ok: false,
            message: "Room not found",
        }
    }

    if (room.host !== session.uuid) {
        return {
            ok: false,
            message: "You are not the host",
        }
    }

    // Check if the song is currently playing
    if (room.current_song === song_id) {
        return {
            ok: false,
            message: "Cannot delete the currently playing song",
        }
    }

    // Delete the song
    const { error: deleteError } = await supabase
        .from("songs")
        .delete()
        .eq("id", song_id)
        .eq("room", room.id)

    if (deleteError) {
        return {
            ok: false,
            message: "Failed to delete song",
        }
    }

    return {
        ok: true,
    }
}
