import { Input } from "../ui/input"
import { SubmitButton } from "../ui/submit-button"
import { setUsername } from "./actions"

export function UsernameForm() {
    return (
        <form action={setUsername}>
            <Input type="text" name="username" />
            <SubmitButton>Set Username</SubmitButton>
        </form>
    )
}
