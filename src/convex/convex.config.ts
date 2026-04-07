import stripe from "@convex-dev/stripe/convex.config.js"
import ossStats from "@erquhart/convex-oss-stats/convex.config"
import { defineApp } from "convex/server"

const app = defineApp()
app.use(stripe)
app.use(ossStats)

export default app
