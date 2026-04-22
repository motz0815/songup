"use client"

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import posthog from "posthog-js"
import { useEffect } from "react"

export function IdentificationProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const user = useQuery(api.auth.getCurrentUser)

    useEffect(() => {
        if (!user?.isAnonymous && user?._id && !posthog._isIdentified())
            posthog.identify(user._id)
    }, [user?._id])

    return <>{children}</>
}
