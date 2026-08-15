"use client"

import { api } from "@/convex/_generated/api"
import { useAuthedMutation } from "@/lib/auth"
import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"

export function NicknameForm() {
    const setNickname = useAuthedMutation(api.nicknames.setNickname)

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
                    minLength={3}
                    maxLength={16}
                    required
                    placeholder="Your nickname"
                    className="border-ink bg-paper h-12 rounded-none border-2 text-base shadow-none"
                />
                <SubmitButton className="border-ink bg-signal hover:bg-signal/90 h-12 rounded-none border-2 font-bold text-white">
                    Enter the room
                </SubmitButton>
            </div>
        </form>
    )
}
