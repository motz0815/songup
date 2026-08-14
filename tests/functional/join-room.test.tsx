import { JoinRoomForm } from "@/components/room/join-room"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { redirectMock } = vi.hoisted(() => ({
    redirectMock: vi.fn(),
}))

vi.mock("next/navigation", () => ({
    redirect: redirectMock,
}))

describe("JoinRoomForm", () => {
    beforeEach(() => {
        redirectMock.mockReset()
    })

    it("exposes the room-code format to the browser", () => {
        render(<JoinRoomForm />)

        const input = screen.getByLabelText(
            "Enter a four-character room code",
        )
        expect(input).toBeRequired()
        expect(input).toHaveAttribute("minlength", "4")
        expect(input).toHaveAttribute("maxlength", "4")
        expect(input).toHaveAttribute("pattern", "[A-Za-z1-9]{4}")
        expect(input).toHaveAccessibleDescription(
            "Room codes contain four letters or numbers.",
        )
    })

    it("normalises a valid code before navigating", async () => {
        const user = userEvent.setup()
        render(<JoinRoomForm defaultCode="ab7k" />)

        await user.click(screen.getByRole("button", { name: /join the room/i }))

        await waitFor(() => {
            expect(redirectMock).toHaveBeenCalledWith("/room/AB7K")
        })
    })

    it("does not submit a code that is too short", async () => {
        const user = userEvent.setup()
        render(<JoinRoomForm />)

        await user.type(
            screen.getByLabelText("Enter a four-character room code"),
            "ABC",
        )
        await user.click(screen.getByRole("button", { name: /join the room/i }))

        expect(redirectMock).not.toHaveBeenCalled()
    })
})
