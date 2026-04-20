import { formatDistance } from "date-fns"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

export function RoomExpiry({
    createdAt,
    expiresAt,
}: {
    createdAt: number
    expiresAt: number
}) {
    return (
        <HoverCard>
            <HoverCardTrigger>
                Expires:{" "}
                <span
                    // If the room expires in less than 6 hours, make the text red
                    className={
                        new Date(expiresAt).getTime() - Date.now() <
                        6 * 60 * 60 * 1000
                            ? "text-red-500"
                            : ""
                    }
                >
                    {formatDistance(new Date(expiresAt), Date.now(), {
                        addSuffix: true,
                    })}
                </span>
            </HoverCardTrigger>
            <HoverCardContent
                align="start"
                className="text-muted-foreground flex flex-col text-sm"
            >
                <p>Created: {new Date(createdAt).toLocaleString()}</p>
                <p>Expires: {new Date(expiresAt).toLocaleString()}</p>
            </HoverCardContent>
        </HoverCard>
    )
}
