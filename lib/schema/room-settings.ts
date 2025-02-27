import { z } from "zod"

export const roomSettingsSchema = z.object({
    max_songs_per_user: z
        .number()
        .min(1, {
            message: "Maximum songs per user must be at least 1",
        })
        .describe(
            "The maximum number of songs a single user can add to the queue at once.",
        ),
    fallback_playlist_id: z
        .string()
        .optional()
        .describe(
            "The ID of the playlist to use as a fallback if the primary playlist is empty.",
        ),
})

export type RoomSettings = z.infer<typeof roomSettingsSchema>
