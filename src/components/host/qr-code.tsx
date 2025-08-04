import { getURL } from "@/lib/utils"
import QRCode from "react-qr-code"

export function RoomQRCode({ roomCode }: { roomCode: string }) {
    const url = getURL(`/room/${roomCode}?utm_source=qr-code`)

    return (
        <div className="h-full rounded-lg bg-white p-3">
            <QRCode
                value={url}
                size={256}
                className="h-full w-full"
                viewBox="0 0 256 256"
            />
        </div>
    )
}
