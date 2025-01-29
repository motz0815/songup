"use client"
import { CornerDownLeft } from "lucide-react"
import { usePostHog } from "posthog-js/react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

type CookieConsent = "undecided" | "yes" | "no"

export function cookieConsentGiven(): CookieConsent {
    const consent = localStorage.getItem("cookie_consent")
    return consent === "yes" || consent === "no" ? consent : "undecided"
}

export default function Cookies() {
    const [consentGiven, setConsentGiven] = useState<CookieConsent | "">("")
    const posthog = usePostHog()

    useEffect(() => {
        // We want this to only run once the client loads
        // or else it causes a hydration error
        setConsentGiven(cookieConsentGiven())

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter" && cookieConsentGiven() === "undecided") {
                handleAcceptCookies()
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [])

    useEffect(() => {
        if (consentGiven !== "undecided") {
            posthog.set_config({
                persistence:
                    consentGiven === "yes" ? "localStorage+cookie" : "memory",
            })
            console.log(
                "setting persistence",
                consentGiven === "yes" ? "localStorage+cookie" : "memory",
            )
        }
    }, [consentGiven])

    const handleAcceptCookies = () => {
        localStorage.setItem("cookie_consent", "yes")
        setConsentGiven("yes")

        // capture the event
        posthog.capture("cookie consent", {
            cookie_consent: "yes",
        })
    }

    const handleDeclineCookies = () => {
        localStorage.setItem("cookie_consent", "no")
        setConsentGiven("no")

        // capture the event
        posthog.capture("cookie consent", {
            cookie_consent: "no",
        })
    }

    return (
        <>
            {consentGiven === "undecided" && (
                <div className="fixed bottom-0 right-0 z-50 w-full max-w-md p-6">
                    <div className="dark rounded-lg border border-white/20 bg-black/50 p-3 shadow-md backdrop-blur-xl">
                        <div className="flex flex-col gap-2">
                            <p className="text-white">
                                SongUp doesn&apos;t use third-party cookies{" "}
                                <span className="text-white/50">
                                    - only a single first-party cookie.
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
