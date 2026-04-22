import posthog from "posthog-js"

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/relay-iljT",
    ui_host: "https://eu.posthog.com",
    cookieless_mode: "on_reject",
    defaults: "2026-01-30",
})
