import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"
import { setUsername } from "./actions"

export function UsernameForm() {
    return (
        <form action={setUsername}>
            <div className="flex flex-col gap-2">
                <Input type="text" name="username" />
                <SubmitButton>Set Username</SubmitButton>
            </div>
        </form>
    )
}
