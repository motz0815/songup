import { SearchSong } from "@/components/room/search-song"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

describe("SearchSong", () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("searches, renders results and passes the selected song to the room", async () => {
        const user = userEvent.setup()
        const onSelect = vi.fn().mockResolvedValue(undefined)
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue([
                {
                    videoId: "video-123",
                    title: "Once in a Lifetime",
                    artists: [{ name: "Talking Heads" }],
                    duration_seconds: 260,
                },
            ]),
        })
        vi.stubGlobal("fetch", fetchMock)
        render(<SearchSong onSelect={onSelect} />)

        await user.type(
            screen.getByPlaceholderText("Search title or artist"),
            "  talking heads  ",
        )
        await user.click(screen.getByRole("button", { name: "Search" }))

        expect(await screen.findByText("Once in a Lifetime")).toBeInTheDocument()
        expect(screen.getByText(/Talking Heads/)).toHaveTextContent(
            "Talking Heads · 4:20",
        )
        expect(fetchMock).toHaveBeenCalledWith(
            "/api/search?query=talking%20heads",
            expect.objectContaining({
                headers: expect.objectContaining({
                    "ngrok-skip-browser-warning": "true",
                }),
            }),
        )

        await user.click(screen.getByRole("button", { name: "Add song" }))

        await waitFor(() => {
            expect(onSelect).toHaveBeenCalledWith({
                videoId: "video-123",
                title: "Once in a Lifetime",
                artist: "Talking Heads",
                duration: 260,
            })
        })
    })

    it("shows the API error and clears stale results", async () => {
        const user = userEvent.setup()
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                json: vi.fn().mockResolvedValue({ error: "Search is offline" }),
            }),
        )
        render(<SearchSong onSelect={vi.fn()} />)

        await user.type(
            screen.getByPlaceholderText("Search title or artist"),
            "anything",
        )
        await user.click(screen.getByRole("button", { name: "Search" }))

        expect(await screen.findByText("Search is offline")).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Add song" })).toBeNull()
    })

    it("shows a useful empty state for a successful search with no matches", async () => {
        const user = userEvent.setup()
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue([]),
            }),
        )
        render(<SearchSong onSelect={vi.fn()} />)

        await user.type(
            screen.getByPlaceholderText("Search title or artist"),
            "obscure song",
        )
        await user.click(screen.getByRole("button", { name: "Search" }))

        expect(
            await screen.findByText(
                "Nothing playable found. Try a different search.",
            ),
        ).toBeInTheDocument()
    })
})
