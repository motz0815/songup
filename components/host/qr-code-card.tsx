import { RoomQRCode } from "./qr-code"

export function QRCodeCard({ roomCode }: { roomCode: string }) {
    return (
        <div className="flex w-full flex-col rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
            <h3 className="mb-2 text-2xl font-bold">Add songs to the queue</h3>
            <p className="mb-4">
                Visit songup.tv and enter room code{" "}
                <span className="font-extrabold">{roomCode}</span>
            </p>
            <div className="flex h-full justify-center">
                <RoomQRCode roomCode={roomCode} />
            </div>
        </div>
    )
}
