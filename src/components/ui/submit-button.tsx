"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export function SubmitButton({
    children,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { pending } = useFormStatus()

    return (
        <Button loading={pending} type="submit" {...props}>
            {children}
        </Button>
    )
}
