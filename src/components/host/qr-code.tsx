"use client"

import { useSyncExternalStore } from "react"
import QRCode from "react-qr-code"

const subscribeToOrigin = () => () => {}
const getBrowserOrigin = () => window.location.origin
const getServerOrigin = () => ""

export function RoomQRCode({ roomCode }: { roomCode: string }) {
    const origin = useSyncExternalStore(
        subscribeToOrigin,
        getBrowserOrigin,
        getServerOrigin,
    )
    const url = (() => {
        if (!origin) return ""
        const roomUrl = new URL(`/room/${roomCode}`, window.location.origin)
        roomUrl.searchParams.set("utm_source", "qr-code")
        return roomUrl.toString()
    })()

    return (
        <div className="h-full max-h-full bg-white p-2">
            {url ? (
                <QRCode
                    value={url}
                    size={128}
                    className="h-full max-h-full w-full"
                    style={{
                        imageRendering: "pixelated",
                    }}
                    viewBox="0 0 128 128"
                />
            ) : (
                <div className="aspect-square h-full max-h-full w-full" />
            )}
        </div>
    )
}
