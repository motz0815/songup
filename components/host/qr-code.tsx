"use client"

import { getURL } from "@/lib/utils"
import { QRCodeSVG } from "qrcode.react"

export function RoomQRCode({ roomCode }: { roomCode: string }) {
    const url = getURL(`/room/${roomCode}?utm_source=qr-code`)

    return (
        <div className="flex items-center justify-center">
            <QRCodeSVG
                className="h-full w-full"
                size={64}
                value={url}
                marginSize={1}
                bgColor="#ffffff00"
                fgColor="#ffffffe5"
            />
        </div>
    )
}
