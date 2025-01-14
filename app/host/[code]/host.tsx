"use client"

import { HostBackground } from "@/components/host/background"
import { QRCodeCard } from "@/components/host/qr-code-card"
import { SongCard } from "@/components/songs/song-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Room } from "@/types/global"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import {
    useQuery,
    useSubscription,
} from "@supabase-cache-helpers/postgrest-react-query"
import { useEffect, useState } from "react"
import YouTube, { YouTubeProps } from "react-youtube"
import { updateCurrentSong } from "./actions"

export default function Host({ room }: { room: Room }) {
    /* 
    STATE
     */

    const [ended, setEnded] = useState(false)

    const [animationParent] = useAutoAnimate()

    /* 
    DATABASE QUERIES
     */

    const supabase = createClient()

    // query the current song from the rooms table
    const { data } = useQuery(
        supabase
            .from("rooms")
            .select("current_song")
            .eq("code", room.code!)
            .single(),
    )
    const currentSong = data?.current_song ?? 0

    // subscribe to changes to the room to update the current song
    useSubscription(
        supabase,
        "postgres_rooms_changes",
        {
            event: "*",
            schema: "public",
            table: "rooms",
            filter: `id=eq.${room.id}`,
        },
        ["id"],
    )

    // query the current song and the songs after it
    // (the ids of the songs are not guaranteed to be sequential (e.g. song 4 is current, the next ones are 6, 9, 10, 11, 15))
    // they are, however, guaranteed to be "in order", i.e. song 7 will always be after song 4
    let { data: songs = [] } = useQuery(
        supabase
            .from("songs")
            .select("*")
            .eq("room", room.id)
            .gte("id", currentSong)
            .order("id"),
    )

    if (!songs) songs = []

    // subscribe to changes in the songs
    useSubscription(
        supabase,
        "postgres_songs_changes",
        {
            event: "*",
            schema: "public",
            table: "songs",
            filter: `room=eq.${room.id}`,
        },
        ["id"],
    )

    // if the queue has ended and a new song comes in, set the current song to the next song in the queue
    useEffect(() => {
        if (ended && songs.length > 1) {
            updateCurrentSong(room.code!, songs[1].id)
            setEnded(false)
        }
    }, [songs, room.code, ended])

    const opts: YouTubeProps["opts"] = {
        width: "100%",
        height: "100%",
        playerVars: {
            autoplay: 1,
        },
        host: "https://www.youtube-nocookie.com",
    }

    const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
        if (event.data === -1) {
            event.target.playVideo()
        }
    }

    // TODO make layout mobile friendly
    return (
        <div className="relative min-h-screen w-screen text-white lg:h-screen">
            <HostBackground
                image={`https://i.ytimg.com/vi_webp/${songs[0]?.video_id}/mqdefault.webp`}
            />
            <div className="grid min-h-screen w-screen grid-cols-1 gap-4 p-4 lg:h-screen lg:grid-cols-3 lg:grid-rows-2">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/50 shadow-2xl outline outline-1 outline-white/20 backdrop-blur-lg lg:col-span-2 lg:row-span-2">
                    {songs[0] && (
                        <YouTube
                            className="z-10 aspect-video w-full"
                            videoId={songs[0].video_id ?? ""}
                            opts={opts}
                            onStateChange={onPlayerStateChange}
                            onEnd={() => {
                                // if the current song is the last one, set the ended state to true
                                if (songs.length === 1) {
                                    setEnded(true)
                                    return
                                }

                                // update the current song server side
                                updateCurrentSong(room.code!, songs[1].id).then(
                                    (response) => {
                                        // if that didn't work, show an error
                                        if (!response.ok) {
                                            toast({
                                                title: "Error",
                                                description: response.message,
                                            })
                                        }
                                    },
                                )
                            }}
                        />
                    )}
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                        <h2 className="text-6xl font-bold">songup.tv</h2>
                        <p className="text-4xl">
                            Enter code{" "}
                            <span className="font-extrabold">{room.code}</span>
                        </p>
                    </div>
                </div>
                <ScrollArea className="rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
                    <ul ref={animationParent} className="space-y-4">
                        {songs.length > 0 ? (
                            songs.map((song) => (
                                <li key={song.id}>
                                    <SongCard
                                        song={song}
                                        active={song.id === currentSong}
                                    />
                                </li>
                            ))
                        ) : (
                            <p className="text-center text-lg">
                                No songs in queue. Visit the room page to add
                                songs.
                            </p>
                        )}
                    </ul>
                </ScrollArea>
                <QRCodeCard roomCode={room.code!} />
            </div>
        </div>
    )
}
