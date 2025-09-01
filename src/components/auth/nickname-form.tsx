"use client"

import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"

export function NicknameForm() {
    const setNickname = useMutation(api.nicknames.setNickname)

    return (
        <form
            action={async (formData) => {
                await setNickname({
                    nickname: formData.get("nickname") as string,
                })
            }}
        >
            <div className="flex flex-col gap-2">
                <Input
                    type="text"
                    name="nickname"
                    placeholder="Enter nickname..."
                    className="bg-background text-foreground"
                />
                <SubmitButton>Set nickname</SubmitButton>
            </div>
        </form>
    )
}
