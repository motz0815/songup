"use client"

import { authClient } from "@/lib/auth-client"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { ConvexReactClient } from "convex/react"
import { ReactNode } from "react"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexBetterAuthProvider client={convex} authClient={authClient}>
            {children}
        </ConvexBetterAuthProvider>
    )
}
