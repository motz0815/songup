import { convexAdapter } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { betterAuth } from "better-auth"
import { anonymous } from "better-auth/plugins"
import { type GenericCtx } from "../convex/_generated/server"
import { betterAuthComponent } from "../convex/auth"
import { getURL } from "./utils"

export const createAuth = (ctx: GenericCtx) =>
    // Configure your Better Auth instance here
    betterAuth({
        // All auth requests will be proxied through your next.js server
        baseURL: getURL(),
        database: convexAdapter(ctx, betterAuthComponent),

        // Simple non-verified email/password to get started
        emailAndPassword: { enabled: false },
        plugins: [
            // The Convex plugin is required
            convex(),
            anonymous(),
        ],
    })
