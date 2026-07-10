"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { Button, ButtonProps } from "@songup/ui/components/button"
import posthog from "posthog-js"
import { FaGoogle } from "react-icons/fa"

export function SignInButton(props?: Omit<ButtonProps, "onClick">) {
    const { signIn } = useAuthActions()
    return (
        <Button
            {...props}
            onClick={() => {
                posthog.capture("signin_clicked")
                void signIn("google", { redirectTo: "/host" })
            }}
        >
            <FaGoogle className="size-4" />
            Sign in with Google
        </Button>
    )
}
