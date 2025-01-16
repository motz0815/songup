"use server"

import { getSession } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { SongInsert } from "@/types/global"
import { revalidatePath } from "next/cache"

export async function addSongToQueue(
    code: string,
    song: Omit<SongInsert, "room">,
) {
    const session = await getSession()

    const supabase = createAdminClient()

    const { data: room, error } = await supabase
        .from("rooms")
        .select()
        .eq("code", code ?? "")
        .single()

    if (error || !room) {
        return {
            ok: false,
            message: "Room not found",
        }
    }

    const { data: songsAddedByUser } = await supabase
        .from("songs")
        .select("id,room,added_by")
        .eq("added_by", session.uuid)
        .eq("room", room.id)
        .gt("id", room.current_song ?? 0)

    if (
        songsAddedByUser &&
        songsAddedByUser.length >= room.max_songs_per_user
    ) {
        return {
            ok: false,
            message: "You can only add 2 songs to the queue at a time.",
        }
    }

    const { data: songInsertData, error: songInsertError } = await supabase
        .from("songs")
        .insert({
            room: room.id,
            title: song.title,
            video_id: song.video_id,
            added_by: session.uuid,
            added_by_name: session.username,
        })
        .select()
        .single()

    if (songInsertError) {
        console.error(songInsertError)
        return {
            ok: false,
            message: "Error adding song to queue",
        }
    }

    // if the song is the first song in the queue, set the current song to the new song
    if (!room.current_song) {
        await supabase
            .from("rooms")
            .update({ current_song: songInsertData.id })
            .eq("id", room.id)
    }

    revalidatePath(`/room/${code}`)

    return {
        ok: true,
    }
}
