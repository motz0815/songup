"use node"

import { v } from "convex/values"
import { internalAction } from "../_generated/server"
import PostHogClient from "./posthog"

export const userSignedUp = internalAction({
    args: {
        userId: v.id("users"),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
    },
    handler: (_, args): void => {
        const posthog = PostHogClient()
        posthog.capture({
            distinctId: args.userId,
            event: "user_signed_up",
            properties: {
                email: args.email,
                name: args.name,
            },
        })
    },
})
