"use client"

import { ErrorFallback } from "@/components/error-fallback"
import "./globals.css"

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string }
}) {
    return (
        <html lang="en" translate="no">
            <body className="antialiased">
                <title>Something went wrong | SongUp</title>
                <ErrorFallback error={error} boundary="global" />
            </body>
        </html>
    )
}
