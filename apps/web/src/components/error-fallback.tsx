"use client"

import { Button } from "@songup/ui/components/button"
import { HomeIcon, RotateCwIcon } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import { useEffect } from "react"

export function ErrorFallback({
    error,
    boundary,
}: {
    error: Error & { digest?: string }
    boundary: "route" | "global"
}) {
    useEffect(() => {
        posthog.captureException(error, {
            error_boundary: boundary,
            digest: error.digest,
        })
    }, [error, boundary])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-4 text-center">
            <h1 className="text-4xl font-bold">Something went wrong</h1>
            <p className="text-lg">
                The page could not be shown. Reload the page to try again.
            </p>
            <div className="flex gap-2">
                <Button onClick={() => window.location.reload()}>
                    <RotateCwIcon className="size-4" /> Reload page
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">
                        <HomeIcon className="size-4" /> Go back to home
                    </Link>
                </Button>
            </div>
        </div>
    )
}
