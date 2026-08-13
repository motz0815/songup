"use client"

import { completeAuthorization } from "@/lib/spotify"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

/**
 * Where Spotify sends the browser back to.
 *
 * The whole token exchange happens here, in the page, because the PKCE code
 * verifier is in this tab's sessionStorage and nowhere else.
 */
export default function SpotifyCallbackPage() {
    return (
        <Suspense fallback={<Status>Connecting to Spotify…</Status>}>
            <Callback />
        </Suspense>
    )
}

function Callback() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        const denied = params.get("error")
        if (denied) {
            setError(
                denied === "access_denied"
                    ? "You didn't grant access, so nothing was exported."
                    : `Spotify returned an error: ${denied}`,
            )
            return
        }

        const code = params.get("code")
        if (!code) {
            setError("Spotify didn't send an authorization code.")
            return
        }

        completeAuthorization(code)
            .then((returnTo) => router.replace(returnTo))
            .catch((cause: unknown) =>
                setError(
                    cause instanceof Error
                        ? cause.message
                        : "Couldn't finish connecting to Spotify.",
                ),
            )
    }, [router])

    if (error) {
        return (
            <Status>
                <p className="mb-4">{error}</p>
                <button
                    type="button"
                    onClick={() => router.replace("/")}
                    className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                >
                    Back to DemocraTune
                </button>
            </Status>
        )
    }

    return <Status>Connecting to Spotify…</Status>
}

function Status({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-500 to-indigo-950 p-6 text-center text-white">
            <div className="max-w-md">{children}</div>
        </main>
    )
}
