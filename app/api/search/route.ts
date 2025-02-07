import { NextResponse } from "next/server"
import YTMusic from "ytmusic-api"

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

        const results = await ytmusic.searchVideos(query)
        const songResults = results.map((result) => ({
            video_id: result.videoId,
            title: result.artist.name + " - " + result.name,
        }))

        return NextResponse.json(songResults)
    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json(
            { error: "Failed to search songs" },
            { status: 500 },
        )
    }
}
