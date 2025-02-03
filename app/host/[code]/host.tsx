"use client"

import { HostBackground } from "@/components/host/background"
import { QRCodeCard } from "@/components/host/qr-code-card"
import { SongCard } from "@/components/songs/song-card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Room } from "@/types/global"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import {
    useQuery,
    useSubscription,
} from "@supabase-cache-helpers/postgrest-react-query"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import YouTube, { YouTubeProps } from "react-youtube"
import { deleteSong, updateCurrentSong } from "./actions"

export default function Host({ room }: { room: Room }) {
    /* 
    STATE
     */

    const [ended, setEnded] = useState(false)

    const [animationParent] = useAutoAnimate()

    const [progress, setProgress] = useState(0)

    const playerRef = useRef<YouTube>(null)

    const queryClient = useQueryClient()

    /*
    EFFECTS
     */

    // track the current song progress
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (ended) return
            if (playerRef.current) {
                const duration = await playerRef.current
                    .getInternalPlayer()
                    ?.getDuration()
                const currentTime = await playerRef.current
                    .getInternalPlayer()
                    ?.getCurrentTime()
                if (duration && currentTime) {
                    setProgress(currentTime / duration)
                }
            }
        }, 1000)

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId)
    }, [])

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
        {
            placeholderData: (prev) => prev,
        },
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
            // Disable cookies and tracking
            enablejsapi: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            controls: 1,
        },
        host: "https://www.youtube-nocookie.com",
    }

    const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
        if (event.data === -1) {
            event.target.playVideo()
        }
    }

    return (
        <div className="relative min-h-screen w-full text-white lg:h-screen">
            <HostBackground videoId={songs[0]?.video_id} />
            <main className="flex h-full flex-col gap-4 p-4">
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="flex w-full flex-col gap-4 lg:col-span-2 lg:row-span-2">
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/50 shadow-2xl outline outline-1 outline-white/20 backdrop-blur-lg">
                            {songs[0] && (
                                <YouTube
                                    ref={playerRef}
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
                                        updateCurrentSong(
                                            room.code!,
                                            songs[1].id,
                                        ).then((response) => {
                                            // if that didn't work, show an error
                                            if (!response.ok) {
                                                toast({
                                                    title: "Error",
                                                    description:
                                                        response.message,
                                                })
                                            }
                                        })
                                    }}
                                />
                            )}
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                                <h2 className="text-6xl font-bold">
                                    songup.tv
                                </h2>
                                <p className="text-4xl">
                                    Enter code{" "}
                                    <span className="font-extrabold">
                                        {room.code}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-center gap-3">
                            <Progress
                                value={progress * 100}
                                max={100}
                                className="dark w-2/3"
                                indicatorClassName="duration-1000 ease-linear"
                            />
                            <h2 className="text-center text-3xl font-bold">
                                {songs[0]?.title || "No song playing"}
                            </h2>
                        </div>
                    </div>
                    <ScrollArea className="rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
                        <ul ref={animationParent} className="space-y-4">
                            {songs.length > 0 ? (
                                songs.map((song) => (
                                    <li key={song.id}>
                                        {song.id === currentSong ? (
                                            <SongCard song={song} active />
                                        ) : (
                                            <SongCard
                                                song={song}
                                                onClick={async () => {
                                                    const response =
                                                        await updateCurrentSong(
                                                            room.code!,
                                                            song.id,
                                                        )
                                                    if (!response.ok) {
                                                        toast({
                                                            title: "Error",
                                                            description:
                                                                response.message,
                                                        })
                                                        console.error(
                                                            "Error updating current song",
                                                            response.message,
                                                        )
                                                    }
                                                }}
                                                onDelete={async () => {
                                                    const response =
                                                        await deleteSong(
                                                            room.code!,
                                                            song.id,
                                                        )
                                                    if (response.ok) {
                                                        // if the song was deleted, invalidate the songs query
                                                        // why? because the subscription has a filter on the room, which will not trigger when a song is deleted
                                                        queryClient.invalidateQueries(
                                                            {
                                                                queryKey: [
                                                                    "postgrest",
                                                                    "null",
                                                                    "public",
                                                                    "songs",
                                                                ],
                                                            },
                                                        )
                                                    } else {
                                                        toast({
                                                            title: "Error",
                                                            description:
                                                                response.message,
                                                        })
                                                        console.error(
                                                            "Error deleting song",
                                                            response.message,
                                                        )
                                                    }
                                                }}
                                            />
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p className="text-center text-lg">
                                    No songs in queue. Visit the room page to
                                    add songs.
                                </p>
                            )}
                        </ul>
                    </ScrollArea>
                    <QRCodeCard roomCode={room.code!} />
                </div>
                <footer className="flex w-full items-center justify-between px-1">
                    <Link href="/">
                        <h2 className="text-3xl font-bold text-white/60">
                            SongUp
                            <span className="text-sm text-white/60">.tv</span>
                        </h2>
                    </Link>
                    <p className="text-3xl font-bold text-white/60">
                        {room.code}
                    </p>
                </footer>
            </main>
        </div>
    )
}
