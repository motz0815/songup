import { joinRoom } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Github, Music, Tv, Users } from "lucide-react"
import Link from "next/link"
import { SubmitButton } from "./ui/submit-button"

export function LandingPageComponent() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
            <main className="flex-1 text-white">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                                    Never fight over the aux again.
                                </h1>
                                <p className="mx-auto max-w-[700px] md:text-xl">
                                    Shared party music queueing made easy.{" "}
                                    <br /> Open source, no login required, just
                                    create a room and let the party begin!
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-4">
                                <Link href="/host">
                                    <Button size="lg" variant="secondary">
                                        Host a room
                                    </Button>
                                </Link>
                                <form action={joinRoom}>
                                    <div className="flex gap-2">
                                        <Input
                                            name="code"
                                            placeholder="Enter room code"
                                            className="text-primary"
                                            required
                                        />
                                        <SubmitButton size="lg">
                                            Join room
                                        </SubmitButton>
                                    </div>
                                </form>
                            </div>
                            <Link
                                href="https://github.com/motz0815/partyq"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-white hover:text-gray-200"
                            >
                                <Github className="h-5 w-5" />
                                <span>View on GitHub</span>
                            </Link>
                        </div>
                    </div>
                </section>
                <section
                    id="how-it-works"
                    className="w-full py-12 md:py-24 lg:py-32"
                >
                    <div className="container px-4 md:px-6">
                        <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            How It Works
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    title: "Create a Room",
                                    description:
                                        "Host starts a new PartyQ room without logging in.",
                                },
                                {
                                    title: "Display QR Code",
                                    description:
                                        "A unique QR code is shown on the host's screen.",
                                },
                                {
                                    title: "Guests Join",
                                    description:
                                        "Party members scan the QR code to join the room.",
                                },
                                {
                                    title: "Add Songs",
                                    description:
                                        "Everyone can add songs to the shared queue.",
                                },
                            ].map((step, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-purple-500">
                                        {index + 1}
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-200">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section
                    id="features"
                    className="w-full py-12 md:py-24 lg:py-32"
                >
                    <div className="container px-4 md:px-6">
                        <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Features
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <Card className="bg-white/10 text-white backdrop-blur-lg">
                                <CardHeader>
                                    <Tv className="mb-2 h-8 w-8" />
                                    <CardTitle>Central Display</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Host page designed for a central TV, showing
                                    the YouTube player, queue, and room QR code.
                                </CardContent>
                            </Card>
                            <Card className="bg-white/10 text-white backdrop-blur-lg">
                                <CardHeader>
                                    <Users className="mb-2 h-8 w-8" />
                                    <CardTitle>Collaborative Queuing</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Party members can add up to 2 songs at once
                                    to the main queue using their devices.
                                </CardContent>
                            </Card>
                            <Card className="bg-white/10 text-white backdrop-blur-lg">
                                <CardHeader>
                                    <Music className="mb-2 h-8 w-8" />
                                    <CardTitle>No Login Required</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Create a room instantly without the need for
                                    user accounts or logins.
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full border-t border-white/10 px-4 py-6 md:px-6">
                <div className="container flex flex-col items-center justify-between sm:flex-row">
                    <p className="text-xs text-white/60">
                        Made with ❤️ by{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                            href="https://github.com/motz0815"
                        >
                            motz
                        </a>
                    </p>
                    <div className="mt-4 flex items-center space-x-4 sm:mt-0">
                        <Link
                            href="https://github.com/motz0815/partyq"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-white hover:text-gray-200"
                        >
                            <Github className="h-5 w-5" />
                            <span className="text-sm">
                                Open Source on GitHub
                            </span>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
