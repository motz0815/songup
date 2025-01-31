import { Vibrant } from "node-vibrant/node"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get("url")

    if (!imageUrl) {
        return Response.json(
            { error: "No image URL provided" },
            { status: 400 },
        )
    }

    try {
        // Get color palette
        const v = new Vibrant(imageUrl)
        const palette = await v.getPalette()

        // Extract the hex colors from the palette
        const hexColors = [
            palette.Vibrant?.hex,
            palette.LightVibrant?.hex,
            palette.DarkVibrant?.hex,
            palette.Muted?.hex,
        ].filter((color): color is string => !!color) // filter out undefined values

        return Response.json({ colors: hexColors })
    } catch (error) {
        console.error("Error processing image:", error)
        return Response.json(
            { error: "Failed to process image" },
            { status: 500 },
        )
    }
}
