"use client"
import { Button } from "@songup/ui/components/button"
import { CornerDownLeft } from "lucide-react"
import posthog from "posthog-js"
import { useEffect, useState } from "react"

function KeyboardHandler({ onEnter }: { onEnter: () => void }) {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                onEnter()
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [onEnter])

    return null
}

type CookieConsent = "granted" | "denied" | "pending"

const CONSENT_STORAGE_KEY = "songup_cookie_consent"

function readStoredConsent(): CookieConsent | null {
    try {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
        if (stored === "granted" || stored === "denied") {
            return stored
        }
    } catch {
        // localStorage can be unavailable.
    }
    return null
}

function storeConsent(consent: CookieConsent) {
    try {
        localStorage.setItem(CONSENT_STORAGE_KEY, consent)
    } catch {
        // localStorage can be unavailable.
    }
}

export default function CookieBanner() {
    const [consentGiven, setConsentGiven] = useState<CookieConsent | "">("")

    useEffect(() => {
        // Defer the browser-only value until after hydration.
        const frame = requestAnimationFrame(() => {
            setConsentGiven(
                readStoredConsent() ?? posthog.get_explicit_consent_status(),
            )
        })

        return () => cancelAnimationFrame(frame)
    }, [])

    function handleAcceptCookies() {
        // Dismiss the banner first, so a failing SDK call cannot keep it open.
        storeConsent("granted")
        setConsentGiven("granted")
        try {
            posthog.opt_in_capturing()
        } catch (error) {
            posthog.captureException(error)
        }
    }

    function handleDeclineCookies() {
        storeConsent("denied")
        setConsentGiven("denied")
        try {
            posthog.opt_out_capturing()
        } catch (error) {
            posthog.captureException(error)
        }
    }

    return (
        <>
            {consentGiven === "pending" && (
                <div className="fixed right-0 bottom-0 z-50 w-full max-w-md p-6">
                    <KeyboardHandler onEnter={handleAcceptCookies} />
                    <div className="dark rounded-lg border border-white/20 bg-black/50 p-3 shadow-md backdrop-blur-xl">
                        <div className="flex flex-col gap-2">
                            <p className="text-white">
                                SongUp doesn&apos;t use third-party cookies.
                                <br />
                                <span className="text-white/50">
                                    See our{" "}
                                    <a
                                        href="/docs/legal/privacy"
                                        className="underline"
                                    >
                                        privacy policy
                                    </a>
                                    .
                                </span>
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    className="text-white"
                                    onClick={handleDeclineCookies}
                                >
                                    Decline
                                </Button>
                                <Button onClick={handleAcceptCookies}>
                                    Accept
                                    <CornerDownLeft />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
