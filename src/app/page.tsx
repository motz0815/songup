import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Home() {
    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        songup gonna be hell of a lot better than before i swear
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Button>Click me</Button>
                </CardContent>
            </Card>
        </div>
    )
}
