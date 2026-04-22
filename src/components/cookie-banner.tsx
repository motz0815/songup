"use client"
import { CornerDownLeft } from "lucide-react"
import posthog from "posthog-js"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

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

export default function CookieBanner() {
    const [consentGiven, setConsentGiven] = useState<CookieConsent | "">("")

    useEffect(() => {
        // We want this to only run once the client loads
        // or else it causes a hydration error
        setConsentGiven(posthog.get_explicit_consent_status())
    }, [])

    function handleAcceptCookies() {
        posthog.opt_in_capturing()
        setConsentGiven("granted")
    }

    function handleDeclineCookies() {
        posthog.opt_out_capturing()
        setConsentGiven("denied")
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
