import stripe from "@convex-dev/stripe/convex.config.js"
import { defineApp } from "convex/server"

const app = defineApp()
app.use(stripe)

export default app
