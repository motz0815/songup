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
})

export type RoomSettings = z.infer<typeof roomSettingsSchema>
