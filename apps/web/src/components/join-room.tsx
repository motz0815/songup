"use client"

import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"

export function JoinRoomForm() {
    async function handleJoinRoom(formData: FormData) {
        const code = (formData.get("code") as string).trim().toUpperCase()
        if (!code) {
            return
        }

        // /room/* is served by the app zone, not the website zone. Use a full
        // navigation so the request goes through the multi-zone rewrite instead
        // of a client-side App Router transition that would 404 here.
        window.location.href = `/room/${code}`
    }

    return (
        <form action={handleJoinRoom}>
            <div className="flex gap-2">
                <Input
                    name="code"
                    placeholder="Enter room code"
                    className="bg-background text-foreground max-w-3xs"
                    required
                    onInput={(e) =>
                        (e.currentTarget.value =
                            e.currentTarget.value.toUpperCase())
                    }
                    minLength={4}
                />
                <SubmitButton className="border border-white/20">
                    Join room
                </SubmitButton>
            </div>
        </form>
    )
}
