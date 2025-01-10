import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import Link from "next/link"
import { joinRoom } from "./actions"

export default function Home() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 font-mono">
            <h1>Welcome to SongUp! (Rewrite of PartyQ)</h1>
            <Link href="/host">
                <Button>Host a room</Button>
            </Link>
            <form action={joinRoom}>
                <div className="flex gap-2">
                    <Input
                        name="code"
                        placeholder="Enter room code"
                        className="text-primary"
                        required
                    />
                    <SubmitButton>Join room</SubmitButton>
                </div>
            </form>
        </div>
    )
}
