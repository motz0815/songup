"use client"

import { useCallback, useEffect } from "react"

export function Fullscreen() {
    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen()
            } else {
                await document.exitFullscreen()
            }
        } catch (error) {
            console.error("Error toggling fullscreen:", error)
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key.toLowerCase() === "f" &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey
            ) {
                // Only trigger if not in an input field
                const target = event.target as HTMLElement
                if (
                    target.tagName !== "INPUT" &&
                    target.tagName !== "TEXTAREA" &&
                    !target.isContentEditable
                ) {
                    event.preventDefault()
                    toggleFullscreen()
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [toggleFullscreen])

    return <></>
}
