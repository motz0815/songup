import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.hourly(
    "clean expired rooms",
    { minuteUTC: 0 },
    internal.rooms.cleanExpiredRooms,
)

export default crons
