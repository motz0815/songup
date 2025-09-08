"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth, useMutation } from "convex/react"
import { FunctionReference, OptionalRestArgs } from "convex/server"
import { useCallback, useEffect, useRef } from "react"

/**
 * A hook that extends Convex's useMutation with pre-mutation logic.
 * It will automatically sign in the user anonymously if they are not signed in, making only authenticated calls to mutations.
 * This hook maintains the same function signature as useMutation to be interchangeable.
 *
 * @param mutation - The Convex mutation function reference
 * @returns A mutation function that runs pre-mutation logic before executing the actual mutation
 */
export function useAuthedMutation<
    Mutation extends FunctionReference<"mutation">,
>(mutation: Mutation) {
    const convexMutation = useMutation(mutation)
    const { isAuthenticated } = useConvexAuth()
    const { signIn } = useAuthActions()

    // Store pending authentication resolvers
    const pendingResolversRef = useRef<
        Array<{
            resolve: () => void
            reject: (error: Error) => void
            timeoutId: NodeJS.Timeout
        }>
    >([])

    /**
     * Waits for the authentication state to become true reactively
     * @param maxWaitTime - Maximum time to wait in milliseconds (default: 5000ms)
     * @returns Promise that resolves when authenticated or rejects on timeout
     */
    const waitForAuthentication = useCallback(
        (maxWaitTime = 5000): Promise<void> => {
            // If already authenticated, resolve immediately
            if (isAuthenticated) {
                return Promise.resolve()
            }

            return new Promise<void>((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    // Remove this resolver from the pending list
                    pendingResolversRef.current =
                        pendingResolversRef.current.filter(
                            (resolver) => resolver.timeoutId !== timeoutId,
                        )
                    reject(new Error("Authentication timeout"))
                }, maxWaitTime)

                // Add this resolver to the pending list
                pendingResolversRef.current.push({
                    resolve,
                    reject,
                    timeoutId,
                })
            })
        },
        [isAuthenticated],
    )

    // React to authentication state changes
    useEffect(() => {
        if (isAuthenticated && pendingResolversRef.current.length > 0) {
            // Resolve all pending authentication promises
            pendingResolversRef.current.forEach(({ resolve, timeoutId }) => {
                clearTimeout(timeoutId)
                resolve()
            })
            // Clear the pending resolvers
            pendingResolversRef.current = []
        }
    }, [isAuthenticated])

    return async (...args: OptionalRestArgs<Mutation>) => {
        // If the user is not signed in, sign them in anonymously first
        if (!isAuthenticated) {
            await signIn("anonymous")
            // Wait for the authentication state to actually update reactively
            await waitForAuthentication()
        }

        // Call the original Convex mutation with the same arguments
        return await convexMutation(...args)
    }
}
