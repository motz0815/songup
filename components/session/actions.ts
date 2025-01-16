"use server"

import { getSession } from "@/lib/session"

export async function setUsername(formData: FormData) {
    const session = await getSession()

    session.username = (formData.get("username") as string) ?? ""
    session.isLoggedIn = true
    await session.save()
}
