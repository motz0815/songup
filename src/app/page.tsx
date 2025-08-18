"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { authClient } from "@/lib/auth-client"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function Home() {
    const user = useQuery(api.auth.getCurrentUser)
    const [anonymousLoading, setAnonymousLoading] = useState(false)
    const router = useRouter()

    const handleAnonymousSignIn = async () => {
        await authClient.signIn.anonymous(
            {},
            {
                onRequest: () => {
                    setAnonymousLoading(true)
                },
                onSuccess: () => {
                    setAnonymousLoading(false)
                    router.push("/")
                },
                onError: (ctx) => {
                    setAnonymousLoading(false)
                    toast.error(ctx.error.message)
                },
            },
        )
    }

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
                    <Button
                        loading={anonymousLoading}
                        onClick={handleAnonymousSignIn}
                    >
                        Click me
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
