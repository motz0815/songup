"use client"

import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Room } from "@/types/global"
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

    // if the current song is null, set it to the first song
    const [currentSong, setCurrentSong] = useState<number>(
        room.current_song ?? 0,
    )

    const [ended, setEnded] = useState(false)

    /* 
    DATABASE QUERIES
     */

    const supabase = createClient()

    // query the current song and the songs after it
    // (the ids of the songs are not guaranteed to be sequential (e.g. song 4 is current, the next ones are 6, 9, 10, 11, 15))
    // they are, however, guaranteed to be "in order", i.e. song 7 will always be after song 4
    const { data: songs } = useQuery(
        supabase
            .from("songs")
            .select("*")
            .eq("room", room.id)
            .gte("id", currentSong)
            .order("id"),
    )

    // subscribe to changes in the songs
    useSubscription(
        supabase,
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "songs",
            filter: `room=eq.${room.id}`,
        },
        ["id"],
    )

    // if the queue has ended and a new song comes in, set the current song to the next song in the queue
    // this is so that the server always has the current song, otherwise clients in the room maybe won't have the right song if an index is skipped
    useEffect(() => {
        if (ended && songs && songs.length > 0) {
            setCurrentSong(songs[0].id)
            updateCurrentSong(room.code!, songs[0].id)
            setEnded(false)
        }
    }, [songs])

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
        <div className="h-full w-full">
            {songs && songs.length > 0 && (
                <YouTube
                    className="aspect-video w-full"
                    videoId={songs[0].video_id ?? ""}
                    opts={opts}
                    onStateChange={onPlayerStateChange}
                    onEnd={() => {
                        // if the current song is the last one, set just the state to one index after the current song, so if another song is added, it will play
                        if (songs.length === 1) {
                            setCurrentSong(songs[0].id + 1)
                            setEnded(true)
                            return
                        }

                        // update the current song server side
                        updateCurrentSong(room.code!, songs[1].id).then(
                            (response) => {
                                // if that worked, update the current song state
                                if (response.ok) {
                                    setCurrentSong(songs[1].id)
                                } else {
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
            <pre>{JSON.stringify(songs, null, 2)}</pre>
        </div>
    )
}
