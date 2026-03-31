import { useAuthActions } from "@convex-dev/auth/react"
import { FaGoogle } from "react-icons/fa"
import { Button, ButtonProps } from "../ui/button"

export function SignInButton(props?: Omit<ButtonProps, "onClick">) {
    const { signIn } = useAuthActions()
    return (
        <Button
            {...props}
            onClick={() => void signIn("google", { redirectTo: "/host" })}
        >
            <FaGoogle className="size-4" />
            Sign in with Google
        </Button>
    )
}
