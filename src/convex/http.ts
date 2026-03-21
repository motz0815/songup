import { registerRoutes } from "@convex-dev/stripe"
import { httpRouter } from "convex/server"
import { components, internal } from "./_generated/api"
import { Id } from "./_generated/dataModel"
import { auth } from "./auth"

const http = httpRouter()

auth.addHttpRoutes(http)

// Register Stripe webhook handler at /stripe/webhook
registerRoutes(http, components.stripe, {
    webhookPath: "/stripe/webhook",
    events: {
        "payment_intent.succeeded": async (ctx, event) => {
            const paymentIntent = event.data.object
            const userId = paymentIntent.metadata.userId

            // Create a pro room for the user
            // We'll just take the latest room for the user
            const room = await ctx.runQuery(
                internal.rooms.manage.getLatestRoomByUser,
                {
                    userId: userId as Id<"users">,
                },
            )
            if (!room) {
                throw new Error("Room not found")
            }

            await ctx.runMutation(internal.rooms.manage.convertToProRoom, {
                roomId: room._id,
            })

            // TODO: Get the room id from the payment intent metadata
            // await ctx.runMutation(internal.rooms.manage.convertToProRoom, {
            //     roomId: paymentIntent.metadata.roomId as Id<"rooms">,
            // })
        },
    },
})

export default http
