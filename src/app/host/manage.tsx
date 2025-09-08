"use client"

import { CreateRoom } from "@/components/host/create-room"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { formatDistance } from "date-fns"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export default function ManageRooms({
    preloadedRooms,
}: {
    preloadedRooms: Preloaded<typeof api.rooms.manage.listOwnRooms>
}) {
    const rooms = usePreloadedQuery(preloadedRooms)

    return (
        <div className="flex min-h-screen flex-col">
            <header className="h-20 border-b">
                <div className="flex h-full items-center justify-between px-4">
                    <Link href="/">
                        <h1 className="text-4xl font-bold">Your Rooms</h1>
                    </Link>
                    <CreateRoom />
                </div>
            </header>
            <main className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-wrap gap-4 p-4">
                    {rooms && rooms.length > 0 ? (
                        <>
                            {rooms.map((room) => (
                                <div
                                    key={room.code}
                                    className="w-full max-w-md"
                                >
                                    <Link
                                        href={`/host/${room.code}`}
                                        key={room.code}
                                    >
                                        <Card className="h-full w-full max-w-md transition-shadow hover:shadow-md">
                                            <CardHeader>
                                                <CardTitle className="text-2xl">
                                                    Room Code: {room.code}
                                                </CardTitle>
                                                <CardDescription>
                                                    Expires:{" "}
                                                    <span
                                                        // If the room expires in less than 6 hours, make the text red
                                                        className={
                                                            new Date(
                                                                room.expiresAt,
                                                            ).getTime() -
                                                                Date.now() <
                                                            6 * 60 * 60 * 1000
                                                                ? "text-red-500"
                                                                : ""
                                                        }
                                                    >
                                                        {formatDistance(
                                                            new Date(
                                                                room.expiresAt,
                                                            ),
                                                            Date.now(),
                                                            {
                                                                addSuffix: true,
                                                            },
                                                        )}
                                                    </span>
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col">
                                                        <h2 className="text-lg font-semibold">
                                                            Settings
                                                        </h2>
                                                        <p className="text-sm">
                                                            {
                                                                room.settings
                                                                    .maxSongsPerUser
                                                            }{" "}
                                                            songs per user
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h2 className="text-lg font-semibold">
                                                            Current Song
                                                        </h2>
                                                        {room.currentSong ? (
                                                            <div className="flex items-center justify-between space-x-4 rounded-lg border p-3 shadow-sm transition-all">
                                                                <ImageWithFallback
                                                                    src={`https://i.ytimg.com/vi_webp/${room.currentSong.videoId}/mqdefault.webp`}
                                                                    width={128}
                                                                    height={128}
                                                                    alt={`${room.currentSong.title}`}
                                                                    className="aspect-video h-20 rounded-lg border border-white/20 object-cover"
                                                                    unoptimized
                                                                />
                                                                <div className="w-full">
                                                                    <h4 className="text-lg font-semibold md:text-xl">
                                                                        {
                                                                            room
                                                                                .currentSong
                                                                                .title
                                                                        }
                                                                    </h4>
                                                                    <p className="text-muted-foreground text-sm md:text-lg">
                                                                        {
                                                                            room
                                                                                .currentSong
                                                                                .artist
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm">
                                                                No song playing
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </div>
                            ))}
                            <Card className="w-full max-w-md border-2 border-dashed shadow-none">
                                <CardContent className="flex h-full items-center justify-center">
                                    <CreateRoom>
                                        <Button variant="outline">
                                            <PlusIcon className="size-4" />
                                            Create another room
                                        </Button>
                                    </CreateRoom>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <Card className="w-full max-w-md border-2 border-dashed shadow-none">
                            <CardContent className="flex h-full items-center justify-center">
                                <CreateRoom>
                                    <Button variant="outline">
                                        <PlusIcon className="size-4" />
                                        Create a room
                                    </Button>
                                </CreateRoom>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    )
}
