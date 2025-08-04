"use client"

import { HostBackground } from "@/components/host/background"
import { RoomQRCode } from "@/components/host/qr-code"
import { Queue } from "@/components/host/queue"
import { Progress } from "@/components/ui/progress"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import YouTube, { YouTubeProps } from "react-youtube"

export default function Host({ roomId }: { roomId: Id<"rooms"> }) {
    /*
     * QUERIES
     */

    const currentSong = useQuery(api.rooms.getCurrentSong, {
        roomId,
    })

    const room = useQuery(api.rooms.getRoom, {
        roomId,
    })

    /*
     * MUTATIONS
     */

    const popSong = useMutation(api.rooms.popSong)

    /*
     * OTHER STATE
     */

    const playerRef = useRef<YouTube>(null)

    const [progress, setProgress] = useState(0)

    /*
     * EFFECTS
     */

    // track the current song progress
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!currentSong) setProgress(0)
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
     * OPTIONS
     */

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
        <div className="relative min-h-screen w-full p-4 text-white lg:h-screen">
            <HostBackground videoId={currentSong?.videoId} />
            <main className="flex h-full w-full flex-col gap-4">
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="flex w-full flex-col gap-4 lg:col-span-2 lg:row-span-2">
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/50 shadow-2xl outline outline-white/20 backdrop-blur-lg">
                            {currentSong && (
                                <YouTube
                                    ref={playerRef}
                                    className="z-10 aspect-video w-full"
                                    videoId={currentSong.videoId ?? ""}
                                    opts={opts}
                                    onStateChange={onPlayerStateChange}
                                    onEnd={() => {
                                        // Pop song from queue
                                        popSong({
                                            roomId,
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
                                        {room?.code}
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
                                {currentSong?.title || "No song playing"}
                            </h2>
                        </div>
                    </div>
                    <Queue roomId={roomId} />
                    <div className="flex w-full flex-col items-center gap-2 rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
                        <h3 className="text-center text-2xl font-bold">
                            Scan to add songs...
                        </h3>
                        <RoomQRCode roomCode={room?.code ?? ""} />
                        <p className="text-center text-lg text-white/80">
                            ...or visit{" "}
                            <span className="font-bold">songup.tv</span> and
                            enter code{" "}
                            <span className="font-bold">{room?.code}</span>
                        </p>
                    </div>
                </div>
                <footer className="flex w-full items-center justify-between px-1">
                    <Link href="/">
                        <h2 className="text-3xl font-bold text-white/80">
                            SongUp
                            <span className="text-sm text-white/80">.tv</span>
                        </h2>
                    </Link>
                    <p className="text-3xl font-bold text-white/80">
                        {room?.code}
                    </p>
                </footer>
            </main>
        </div>
    )
}
