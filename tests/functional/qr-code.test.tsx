import { RoomQRCode } from "@/components/host/qr-code"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("react-qr-code", () => ({
    default: ({ value }: { value: string }) => (
        <output aria-label="Room QR URL">{value}</output>
    ),
}))

describe("RoomQRCode", () => {
    it("uses the current browser origin instead of a build-time URL", async () => {
        render(<RoomQRCode roomCode="AB12" />)

        expect(await screen.findByLabelText("Room QR URL")).toHaveTextContent(
            `${window.location.origin}/room/AB12?utm_source=qr-code`,
        )
    })
})
