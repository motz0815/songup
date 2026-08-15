"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import { redirect } from "next/navigation"

export function JoinRoomForm({
    variant = "paper",
    defaultCode = "",
    className,
}: {
    variant?: "paper" | "landing"
    defaultCode?: string
    className?: string
}) {
    async function handleJoinRoom(formData: FormData) {
        const code = (formData.get("code") as string).trim().toUpperCase()
        if (!code) {
            return
        }

        redirect(`/room/${code}`)
    }

    return (
        <form action={handleJoinRoom} className={cn("w-full", className)}>
            <Label htmlFor="room-code" className="sr-only">
                Enter a four-character room code
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    id="room-code"
                    name="code"
                    defaultValue={defaultCode}
                    placeholder="AB7K"
                    className={cn(
                        "font-code h-14 min-w-0 flex-1 rounded-none border-2 px-4 text-2xl font-bold tracking-[0.28em] uppercase shadow-none placeholder:opacity-35 sm:max-w-64",
                        variant === "landing"
                            ? "border-white/55 bg-black/25 text-white placeholder:text-white placeholder:opacity-50 focus-visible:border-white focus-visible:ring-white/30"
                            : "border-ink bg-paper text-ink placeholder:text-ink/55 focus-visible:border-broadcast",
                    )}
                    required
                    minLength={4}
                    maxLength={4}
                    pattern="[A-Za-z1-9]{4}"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    aria-describedby="room-code-hint"
                />
                <SubmitButton
                    className={cn(
                        "h-14 rounded-none border-2 px-6 text-base font-bold",
                        variant === "landing"
                            ? "text-ink border-white bg-white hover:bg-white/85"
                            : "border-ink bg-signal hover:bg-signal/90 text-white",
                    )}
                >
                    Join the room <ArrowUpRight className="size-4" />
                </SubmitButton>
            </div>
            <span id="room-code-hint" className="sr-only">
                Room codes contain four letters or numbers.
            </span>
        </form>
    )
}
