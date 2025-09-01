"use client"

import { api } from "@/convex/_generated/api"
import { useConvexAuth, useQuery } from "convex/react"
import { ReactNode } from "react"

/**
 * Renders children if the client is not authenticated or has not yet set a nickname.
 */
export function UnauthenticatedOrNoNickname({
    children,
}: {
    children: ReactNode
}) {
    const { isLoading, isAuthenticated } = useConvexAuth()
    const nickname = useQuery(api.nicknames.getNickname)
    if ((isLoading || isAuthenticated) && nickname) {
        return null
    }
    return <>{children}</>
}
