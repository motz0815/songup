"use client"

// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { useState } from "react"

function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    if (typeof window !== "undefined") {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            api_host: "/ingest",
            ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
            person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
        })
    }
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <CSPostHogProvider>{children}</CSPostHogProvider>
        </QueryClientProvider>
    )
}
