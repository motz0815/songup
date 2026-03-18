import { registerRoutes } from "@convex-dev/stripe"
import { httpRouter } from "convex/server"
import { components } from "./_generated/api"
import { auth } from "./auth"

const http = httpRouter()

auth.addHttpRoutes(http)

// Register Stripe webhook handler at /stripe/webhook
registerRoutes(http, components.stripe, {
    webhookPath: "/stripe/webhook",
})

export default http
