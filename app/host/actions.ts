"use server"

import { roomSettingsSchema } from "@/lib/schema/room-settings"
import { getSession } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStatusRedirect } from "@/lib/utils"
import { ActionState } from "@/types/action-state"
import { redirect } from "next/navigation"

export async function createRoom(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    // parse the form data
    const validatedFields = roomSettingsSchema.safeParse({
        max_songs_per_user: Number(formData.get("max_songs_per_user")),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors)
        return {
            ok: false,
            error: "The form data is invalid",
        }
    }

    const session = await getSession()
    session.isLoggedIn = true

    const supabase = createAdminClient()

    // Create a new room in the database
    const { data: room, error } = await supabase
        .from("rooms")
        .insert({
            host: session.uuid,
            max_songs_per_user: validatedFields.data.max_songs_per_user,
        })
        .select()
        .single()

    if (error || !room) {
        console.error(error)
        return {
            ok: false,
            error: "Room creation failed",
        }
    }

    await session.save()

    redirect(getStatusRedirect(`/host/${room.code}`, "Room created"))
}
