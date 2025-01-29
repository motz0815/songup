"use client"

// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect, useState } from "react"
import { cookieConsentGiven } from "./cookies"
import PostHogPageView from "./posthog-pageview"

function PostHogProvider({ children }: { children: React.ReactNode }) {
    // disable posthog for now
    return children

    useEffect(() => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            api_host: "/ingest",
            ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
            capture_pageview: false, // Disable automatic pageview capture, as we capture manually
            capture_pageleave: true, // Enable pageleave capture
            person_profiles: "identified_only",
            persistence:
                cookieConsentGiven() === "yes"
                    ? "localStorage+cookie"
                    : "memory",
        })
    }, [])

    return (
        <PHProvider client={posthog}>
            <PostHogPageView />
            {children}
        </PHProvider>
    )
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <PostHogProvider>{children}</PostHogProvider>
        </QueryClientProvider>
    )
}
