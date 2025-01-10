"use server"

import { getSession } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { getErrorRedirect, getStatusRedirect } from "@/lib/utils"
import { redirect } from "next/navigation"

export async function createRoom() {
    const session = await getSession()
    session.isLoggedIn = true

    const supabase = createAdminClient()

    // Create a new room in the database
    const { data, error } = await supabase
        .from("rooms")
        .insert({
            host: session.uuid,
        })
        .select()
        .single()

    if (error || !data) {
        redirect(
            getErrorRedirect(
                "/host",
                "Room creation failed",
                error?.message ?? "An unknown error occurred",
            ),
        )
    }

    await session.save()

    redirect(getStatusRedirect(`/host/${data.code}`, "Room created"))
}
