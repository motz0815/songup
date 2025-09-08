"use client"

import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import { redirect } from "next/navigation"

export function JoinRoomForm() {
    async function handleJoinRoom(formData: FormData) {
        const code = (formData.get("code") as string).trim().toUpperCase()
        if (!code) {
            return
        }

        redirect(`/room/${code}`)
    }

    return (
        <form action={handleJoinRoom}>
            <div className="flex gap-2">
                <Input
                    name="code"
                    placeholder="Enter room code"
                    className="bg-background text-foreground max-w-3xs"
                    required
                    minLength={4}
                />
                <SubmitButton className="border border-white/20">
                    Join room
                </SubmitButton>
            </div>
        </form>
    )
}
