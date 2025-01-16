"use server"

import { getSession } from "@/lib/session"

export type SongResult = {
    title: string
    video_id: string
    added_by: string
    added_by_name: string
}

export async function searchSong(query: string): Promise<SongResult[]> {
    const session = await getSession()

    type InternalSongResult = {
        id: string
        type: "video"
        thumbnail: { thumbnails: [] }
        title: string
        channelTitle: string
        shortBylineText: { runs: [] }
        length: { accessibility: Object; simpleText: string }
        isLive: boolean
    }

    const api = require("youtube-search-api")
    const result: InternalSongResult[] = (
        await api.GetListByKeyword(query, false, 10, [{ type: "video" }])
    ).items

    return result.map((song) => ({
        title: song.title,
        video_id: song.id,
        added_by: session.uuid,
        added_by_name: session.username,
    }))
}
