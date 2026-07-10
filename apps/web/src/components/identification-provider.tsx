"use client"

import { api } from "@songup/backend/convex/_generated/api"
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
        if (!user?.isAnonymous && user?._id && !posthog._isIdentified()) {
            posthog.opt_in_capturing({
                captureProperties: {
                    source: "sign-in",
                },
            })
            posthog.identify(user._id, {
                email: user.email,
                name: user.name,
            })
        }
    }, [user?._id, user?.email, user?.isAnonymous, user?.name])

    return <>{children}</>
}
