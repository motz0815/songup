"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Badge } from "../ui/badge"

const demos = [
    {
        id: "host-view",
        title: "Host View",
        description:
            "The host sets up a central display with player, queue and a QR code",
        src: "/demos/host-view.mp4",
    },
    {
        id: "search-songs",
        title: "Search & Add",
        description: "Guests search YouTube and add songs to the shared queue",
        src: "/demos/search-add.mp4",
    },
    {
        id: "queue-management",
        title: "Queue Management",
        description:
            "The host can reorder, skip, or remove songs from the queue",
        src: "/demos/queue-management.mp4",
        pro: true,
    },
    {
        id: "join-room",
        title: "Join a Room",
        description: "Guests scan the QR code or enter the room code to join",
        src: "/demos/join-room.mp4",
    },
]

export function DemoSection() {
    const [activeIndex, setActiveIndex] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)
    const barRef = useRef<HTMLDivElement>(null)
    const rafRef = useRef<number>(0)

    useEffect(() => {
        const video = videoRef.current
        const bar = barRef.current
        if (!video) return
        if (bar) bar.style.transform = "scaleX(0)"
        video.play().catch(() => {})

        function tick() {
            if (video && bar && video.duration) {
                bar.style.transform = `scaleX(${video.currentTime / video.duration})`
            }
            rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafRef.current)
    }, [activeIndex])

    function handleEnded() {
        setActiveIndex((prev) => (prev + 1) % demos.length)
    }

    return (
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <h2 className="mb-4 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    How SongUp works
                </h2>
                <p className="mx-auto mb-12 max-w-2xl text-center text-white/70">
                    The host connects to the speakers and creates a room. Guests
                    join the room using the QR or room code and start adding
                    songs.
                </p>

                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1fr_380px]">
                    {/* Video Player */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/20 bg-black/40 backdrop-blur-lg">
                        <video
                            ref={videoRef}
                            src={demos[activeIndex].src}
                            className="absolute inset-0 size-full object-cover"
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleEnded}
                        />
                    </div>

                    {/* Selector Cards */}
                    <div className="flex flex-col gap-3">
                        {demos.map((demo, i) => (
                            <Card
                                key={demo.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => setActiveIndex(i)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        setActiveIndex(i)
                                    }
                                }}
                                className={cn(
                                    "relative flex-1 cursor-pointer overflow-hidden border border-white/20 bg-white/5 text-white backdrop-blur-lg transition-all",
                                    activeIndex === i
                                        ? "border-white/50 bg-white/15 shadow-lg"
                                        : "hover:bg-white/10",
                                )}
                            >
                                <CardHeader className="flex items-center justify-between">
                                    <CardTitle className="text-base">
                                        {demo.title}
                                    </CardTitle>
                                    {demo.pro && (
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">
                                                Pro
                                            </Badge>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="text-sm text-white/60">
                                    {demo.description}
                                </CardContent>
                                <div
                                    ref={activeIndex === i ? barRef : undefined}
                                    className={cn(
                                        "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white/60",
                                        activeIndex !== i && "hidden",
                                    )}
                                />
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
