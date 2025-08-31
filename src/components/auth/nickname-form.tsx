import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"

export function NicknameForm() {
    const setNickname = useMutation(api.nickname.setNickname)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        setNickname({
            nickname: (e.target as HTMLFormElement).nickname.value,
        })
    }

    return (
        <form onSubmit={handleSubmit}>
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
