"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"

const demos = [
    {
        id: "host-view",
        title: "Host View",
        description: "See the central display with player, queue, and QR code",
        src: "/demos/host-view.mp4",
    },
    {
        id: "search-songs",
        title: "Search & Add",
        description: "Search YouTube and add songs to the shared queue",
        src: "/demos/search-add.mp4",
    },
    {
        id: "queue-management",
        title: "Queue Management",
        description: "Reorder, skip, or remove songs from the queue",
        src: "/demos/queue-management.mp4",
    },
    {
        id: "join-room",
        title: "Join a Room",
        description: "Scan the QR code or enter the room code to join",
        src: "/demos/join-room.mp4",
    },
]

export function DemoSection() {
    const [activeIndex, setActiveIndex] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)

    const activeDemo = demos[activeIndex]

    function selectDemo(index: number) {
        setActiveIndex(index)
        if (videoRef.current) {
            videoRef.current.load()
        }
    }

    function handleEnded() {
        const next = (activeIndex + 1) % demos.length
        setActiveIndex(next)
    }

    return (
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <h2 className="mb-4 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    See it in Action
                </h2>
                <p className="mx-auto mb-12 max-w-2xl text-center text-white/70">
                    Watch how SongUp works in real time — from hosting a room to
                    queueing songs collaboratively.
                </p>

                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1fr_380px]">
                    {/* Video Player */}
                    <div className="overflow-hidden rounded-xl border border-white/20 bg-black/40 backdrop-blur-lg lg:aspect-auto">
                        <video
                            ref={videoRef}
                            key={activeDemo.id}
                            className="size-full object-contain"
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleEnded}
                        >
                            <source src={activeDemo.src} type="video/mp4" />
                        </video>
                    </div>

                    {/* Selector Cards */}
                    <div className="flex flex-col gap-3">
                        {demos.map((demo, i) => (
                            <Card
                                key={demo.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => selectDemo(i)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        selectDemo(i)
                                    }
                                }}
                                className={cn(
                                    "flex-1 cursor-pointer gap-0 border-white/20 bg-white/5 text-white backdrop-blur-lg transition-all",
                                    activeIndex === i
                                        ? "border-white/50 bg-white/15 shadow-lg"
                                        : "hover:bg-white/10",
                                )}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {demo.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-white/60">
                                    {demo.description}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
