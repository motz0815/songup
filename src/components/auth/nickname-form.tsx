import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"

export function NicknameForm() {
    return (
        <form action={() => {}}>
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
