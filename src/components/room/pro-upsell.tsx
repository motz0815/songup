"use client"

import { Id } from "@/convex/_generated/dataModel"
import { ArrowBigUpDashIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { UpgradeRoom } from "../host/upgrade-room"
import { Button } from "../ui/button"

export function ProUpsell({ roomId }: { roomId: Id<"rooms"> }) {
    const [dismissed, setDismissed] = useState(false)

    return (
        <>
            {dismissed ? null : (
                <section className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Host controls</h2>
                    <div className="relative flex flex-col gap-2 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                                setDismissed(true)
                            }}
                        >
                            <XIcon />
                        </Button>
                        <p className="mr-6">
                            Want to control the room from here?{" "}
                        </p>
                        <UpgradeRoom roomId={roomId}>
                            <Button>
                                <ArrowBigUpDashIcon data-icon="inline-start" />
                                Upgrade to Pro
                            </Button>
                        </UpgradeRoom>
                    </div>
                </section>
            )}
        </>
    )
}
