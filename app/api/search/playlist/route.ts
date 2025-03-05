import { NextResponse } from "next/server"
import YTMusic from "ytmusic-api"

export type PlaylistResult = {
    id: string
    title: string
    author: string
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get("q")

        if (!query) {
            return NextResponse.json(
                { error: "Query parameter is required" },
                { status: 400 },
            )
        }

        const ytmusic = new YTMusic()
        await ytmusic.initialize()

        const results = await ytmusic.searchPlaylists(query)
        const playlistResults: PlaylistResult[] = results.map((result) => ({
            id: result.playlistId,
            title: result.name,
            author: result.artist.name,
        }))

        return NextResponse.json(playlistResults)
    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json(
            { error: "Failed to search playlists" },
            { status: 500 },
        )
    }
}
