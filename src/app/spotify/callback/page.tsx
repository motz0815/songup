"use client"

import { BrandMark } from "@/components/brand/brand-mark"
import { TallyField } from "@/components/brand/tally-field"
import { completeAuthorization } from "@/lib/spotify"
import { useRouter, useSearchParams } from "next/navigation"
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
    const searchParams = useSearchParams()
    const [asyncError, setAsyncError] = useState<string | null>(null)
    const denied = searchParams.get("error")
    const code = searchParams.get("code")
    const authorizationError = denied
        ? denied === "access_denied"
            ? "You didn't grant access, so nothing was exported."
            : `Spotify returned an error: ${denied}`
        : !code
          ? "Spotify didn't send an authorization code."
          : null

    useEffect(() => {
        if (authorizationError || !code) return

        completeAuthorization(code)
            .then((returnTo) => router.replace(returnTo))
            .catch((cause: unknown) =>
                setAsyncError(
                    cause instanceof Error
                        ? cause.message
                        : "Couldn't finish connecting to Spotify.",
                ),
            )
    }, [authorizationError, code, router])

    const error = authorizationError ?? asyncError

    if (error) {
        return (
            <Status>
                <p className="mb-4">{error}</p>
                <button
                    type="button"
                    onClick={() => router.replace("/")}
                    className="border-ink bg-signal hover:bg-signal/90 focus-visible:ring-broadcast/35 border-2 px-4 py-2 text-sm font-bold text-white transition-colors focus-visible:ring-4 focus-visible:outline-none"
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
        <main className="paper-field text-ink relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 text-center">
            <div className="text-broadcast absolute right-[-5rem] bottom-[-5rem] h-72 w-80 opacity-20">
                <TallyField />
            </div>
            <div className="relative max-w-md">
                <BrandMark compact className="mb-8 text-4xl" />
                <div className="font-display border-ink border-y-2 py-6 text-2xl font-bold">
                    {children}
                </div>
            </div>
        </main>
    )
}
