import { PostHog } from "posthog-node"

export default function getPostHog() {
    const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
        flushAt: 1,
        flushInterval: 0,
        enableExceptionAutocapture: true,
    })
    return posthogClient
}
