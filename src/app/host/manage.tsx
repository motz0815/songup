"use client"

import { UserButton } from "@/components/auth/user-button"
import { CreateRoomForm } from "@/components/host/create-room"
import { RoomExpiry } from "@/components/host/room-expiry"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { ArrowBigUpDashIcon, ArrowRightIcon, PlusIcon } from "lucide-react"
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
                        <h1 className="text-2xl font-bold lg:text-4xl">
                            <span className="hidden lg:inline">Your</span> Rooms
                        </h1>
                    </Link>
                    <UserButton />
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
                                    <Card className="h-full w-full max-w-md">
                                        <CardHeader>
                                            <CardTitle className="text-2xl">
                                                <Link
                                                    href={`/host/${room.code}`}
                                                    className="hover:underline"
                                                >
                                                    Room Code: {room.code}
                                                </Link>
                                            </CardTitle>
                                            <CardDescription>
                                                <RoomExpiry
                                                    createdAt={
                                                        room._creationTime
                                                    }
                                                    expiresAt={room.expiresAt}
                                                />
                                            </CardDescription>
                                            <CardAction>
                                                {room.proStatus === "active" ? (
                                                    <Badge className="m-1">
                                                        Pro
                                                    </Badge>
                                                ) : (
                                                    <Button variant="outline">
                                                        <ArrowBigUpDashIcon
                                                            className="size-4"
                                                            data-icon="inline-start"
                                                        />
                                                        Upgrade
                                                    </Button>
                                                )}
                                            </CardAction>
                                        </CardHeader>
                                        <CardContent className="h-full">
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
                                                <div className="flex flex-col gap-1">
                                                    <h2 className="text-lg font-semibold">
                                                        Current Song
                                                    </h2>
                                                    {room.currentSong ? (
                                                        <Item
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <ItemMedia>
                                                                <ImageWithFallback
                                                                    src={`https://i.ytimg.com/vi_webp/${room.currentSong.videoId}/mqdefault.webp`}
                                                                    width={128}
                                                                    height={128}
                                                                    alt={`${room.currentSong.title}`}
                                                                    className="aspect-video h-12 w-auto rounded-lg border border-white/20 object-cover"
                                                                    unoptimized
                                                                />
                                                            </ItemMedia>
                                                            <ItemContent>
                                                                <ItemTitle>
                                                                    {
                                                                        room
                                                                            .currentSong
                                                                            .title
                                                                    }
                                                                </ItemTitle>
                                                                <ItemDescription>
                                                                    {
                                                                        room
                                                                            .currentSong
                                                                            .artist
                                                                    }
                                                                </ItemDescription>
                                                            </ItemContent>
                                                            <ItemContent className="flex-none text-center">
                                                                <ItemDescription>
                                                                    {Math.floor(
                                                                        room
                                                                            .currentSong
                                                                            .duration /
                                                                            60,
                                                                    )}
                                                                    :
                                                                    {Math.floor(
                                                                        room
                                                                            .currentSong
                                                                            .duration %
                                                                            60,
                                                                    )
                                                                        .toString()
                                                                        .padStart(
                                                                            2,
                                                                            "0",
                                                                        )}
                                                                </ItemDescription>
                                                            </ItemContent>
                                                        </Item>
                                                    ) : (
                                                        <p className="text-sm">
                                                            No song playing
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                            <Link href={`/host/${room.code}`}>
                                                <Button variant="outline">
                                                    <ArrowRightIcon className="size-4" />
                                                    Open
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </div>
                            ))}
                            <div className="w-full max-w-md rounded-xl border-2 border-dashed py-4 shadow-none ring-0">
                                <div className="flex h-full items-center justify-center">
                                    <CreateRoomForm>
                                        <Button variant="outline">
                                            <PlusIcon className="size-4" />
                                            Create another room
                                        </Button>
                                    </CreateRoomForm>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full max-w-md rounded-xl border-2 border-dashed py-4 shadow-none ring-0">
                            <div className="flex h-full items-center justify-center">
                                <CreateRoomForm>
                                    <Button variant="outline">
                                        <PlusIcon className="size-4" />
                                        Create a room
                                    </Button>
                                </CreateRoomForm>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
