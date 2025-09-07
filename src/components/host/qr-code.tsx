import { getURL } from "@/lib/utils"
import QRCode from "react-qr-code"

export function RoomQRCode({ roomCode }: { roomCode: string }) {
    const url = getURL(`/room/${roomCode}?utm_source=qr-code`)

    return (
        <div className="h-full max-h-full rounded-lg bg-white p-3">
            <QRCode
                value={url}
                size={128}
                className="h-full max-h-full w-full"
                style={{
                    imageRendering: "pixelated",
                }}
                viewBox="0 0 128 128"
            />
        </div>
    )
}
