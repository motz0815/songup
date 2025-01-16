import { randomUUID, UUID } from "crypto"
import { getIronSession, SessionOptions } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
    uuid: UUID
    username: string
    isLoggedIn: boolean
}

export const sessionOptions: SessionOptions = {
    password:
        process.env.SESSION_SECRET ??
        "default-very-secure-session-secret-that-is-32-characters-long",
    cookieName: "songup-session",
    cookieOptions: {
        secure:
            process.env.VERCEL_ENV === "production" ||
            process.env.VERCEL_ENV === "preview",
    },
}

export async function getSession() {
    const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions,
    )

    if (!session.isLoggedIn) {
        session.isLoggedIn = false
        session.username = ""
        session.uuid = randomUUID()
    }

    return session
}
