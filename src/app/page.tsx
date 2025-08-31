"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"

export default function Home() {
    const user = useQuery(api.auth.getCurrentUser)
    const { signIn } = useAuthActions()

    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        songup gonna be hell of a lot better than before i swear
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                    <Button onClick={() => signIn("anonymous")}>
                        Click me
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
