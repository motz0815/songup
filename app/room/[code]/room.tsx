"use client"

import { SongResult } from "@/components/room/actions"
import { SearchSongDialog } from "@/components/room/search-dialog"
import { UsernameForm } from "@/components/session/username-form"
import { toast } from "@/hooks/use-toast"
import { Room, Song } from "@/types/global"
import { UUID } from "crypto"
import { useState } from "react"
import { addSongToQueue } from "./actions"

export function RoomPage({
    room,
    songs,
    user,
}: {
    room: Room
    songs: Song[]
    user: {
        isLoggedIn: boolean
        username: string
        uuid: UUID
    }
}) {
    const [dialogOpen, setDialogOpen] = useState(false)

    const songsAddedByUser = songs?.filter(
        (song) =>
            song.added_by === user.uuid && song.id > (room?.current_song ?? 0),
    )

    const songsLeftToAdd =
        room?.max_songs_per_user &&
        room.max_songs_per_user - (songsAddedByUser?.length ?? 0)

    async function addSong(song: SongResult) {
        const response = await addSongToQueue(room.code!, song)
        if (response.ok) {
            toast({ title: "Song added to queue!" })
            // close dialog
            setDialogOpen(false)
        } else {
            toast({ title: "Error adding song", description: response.message })
        }
    }

    return (
        <div>
            {!user.isLoggedIn || !user.username ? (
                <UsernameForm />
            ) : (
                <>
                    <SearchSongDialog
                        addSong={addSong}
                        open={dialogOpen}
                        setOpen={setDialogOpen}
                        disableTrigger={songsLeftToAdd <= 0}
                    />
                    <p>{songsLeftToAdd} songs left to add.</p>
                </>
            )}
        </div>
    )
}
