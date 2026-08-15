import { RoomCode } from "@/components/brand/room-code"
import { QuorumMeter } from "@/components/ui/quorum-meter"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

describe("RoomCode", () => {
    it("announces the complete code while keeping its animated characters decorative", () => {
        const { container } = render(
            <RoomCode code="AB7K" label="Tonight's room" />,
        )

        expect(
            screen.getByLabelText("Tonight's room: AB7K"),
        ).toBeInTheDocument()
        expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(
            4,
        )
        expect(screen.queryByText("Tonight's room")).not.toBeInTheDocument()
    })
})

describe("QuorumMeter", () => {
    it("renders one pip per required vote and announces its progress", () => {
        const { container } = render(<QuorumMeter votes={2} required={4} />)
        const meter = screen.getByRole("meter", {
            name: "2 of 4 votes to skip",
        })

        expect(meter).toHaveAttribute("aria-valuenow", "2")
        expect(meter).toHaveAttribute("aria-valuemax", "4")
        expect(screen.getByText("2 of 4 to skip")).toBeInTheDocument()
        expect(container.querySelectorAll(".bg-quorum")).toHaveLength(2)
    })

    it("switches to proportional progress for large rooms", () => {
        const { container } = render(
            <QuorumMeter votes={5} required={20} tone="light" />,
        )

        expect(container.querySelector("[style='width: 25%;']")).toBeTruthy()
    })

    it("makes the completed state explicit", () => {
        render(<QuorumMeter votes={3} required={3} />)

        expect(screen.getByText("Skipping")).toBeInTheDocument()
    })
})
