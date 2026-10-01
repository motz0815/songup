"use client"

import { ErrorFallback } from "@/components/error-fallback"

export default function Error({
    error,
}: {
    error: Error & { digest?: string }
}) {
    return <ErrorFallback error={error} boundary="route" />
}
