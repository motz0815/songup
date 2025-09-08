import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Music, Tv, Users } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { FaDiscord, FaGithub } from "react-icons/fa"
import { LandingBackground } from "./background"

export const metadata: Metadata = {
    title: "SongUp - Open source shared music queue for parties",
}

export default function Home() {
    return (
        <>
            <LandingBackground />
            <div className="flex min-h-screen flex-col items-center text-white">
                <header className="w-full border-b border-white/20 px-4 py-6 text-center md:px-6">
                    <Link href="/">
                        <h1 className="text-2xl font-bold tracking-tighter text-shadow-md sm:text-3xl md:text-4xl">
                            SongUp
                        </h1>
                    </Link>
                </header>
                <main className="flex-1">
                    <section className="w-full py-12 lg:py-24">
                        <div className="container px-4 md:px-6">
                            <div className="flex flex-col gap-4 rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
                                <h1 className="text-center text-4xl font-bold tracking-tighter text-shadow-md sm:text-5xl md:text-left md:text-6xl lg:text-7xl/none">
                                    Never fight over the aux again.
                                </h1>
                                <p className="text-center text-shadow-sm md:text-right md:text-xl">
                                    SongUp makes shared party music queueing
                                    easy.
                                    <br /> Open source, no login required.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-baseline gap-2">
                                        <Link href="/host">
                                            <Button
                                                size="lg"
                                                className="border border-white/20 text-lg"
                                            >
                                                Host your own room
                                            </Button>
                                        </Link>
                                        or
                                    </div>
                                    <form>
                                        <div className="flex gap-2">
                                            <Input
                                                name="code"
                                                placeholder="Enter room code"
                                                className="bg-background text-foreground max-w-3xs"
                                                required
                                            />
                                            <SubmitButton className="border border-white/20">
                                                Join room
                                            </SubmitButton>
                                        </div>
                                    </form>
                                </div>
                                <div className="mt-4 flex justify-center gap-4 md:justify-end">
                                    <a
                                        href="https://github.com/motz0815/songup"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 text-white hover:text-gray-200"
                                    >
                                        <FaGithub className="size-5" />
                                        <span>View on GitHub</span>
                                    </a>
                                    <a
                                        href="/discord"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 text-white hover:text-gray-200"
                                    >
                                        <FaDiscord className="size-5" />
                                        <span>Join Discord</span>
                                    </a>
                                </div>
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
                                <Card className="border-white/20 bg-white/10 text-white shadow-md backdrop-blur-lg">
                                    <CardHeader>
                                        <Tv className="mb-2 h-8 w-8" />
                                        <CardTitle>Central Display</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        Host page designed for a central TV,
                                        showing the YouTube player, queue, and
                                        room QR code.
                                    </CardContent>
                                </Card>
                                <Card className="border-white/20 bg-white/10 text-white shadow-md backdrop-blur-lg">
                                    <CardHeader>
                                        <Users className="mb-2 h-8 w-8" />
                                        <CardTitle>
                                            Collaborative Queuing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        Party members can add up to 2 songs at
                                        once to the main queue using their
                                        devices.
                                    </CardContent>
                                </Card>
                                <Card className="border-white/20 bg-white/10 text-white shadow-md backdrop-blur-lg">
                                    <CardHeader>
                                        <Music className="mb-2 h-8 w-8" />
                                        <CardTitle>No Login Required</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        Create a room instantly without the need
                                        for user accounts or logins.
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>
                </main>
                <footer className="w-full border-t border-white/20 px-4 py-6 md:px-6">
                    <div className="flex flex-col items-center justify-between sm:flex-row">
                        <p className="text-xs text-white/80">
                            Made with ❤️ by{" "}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                                href="https://github.com/motz0815"
                            >
                                matthias
                            </a>
                        </p>
                        <div className="mt-4 flex items-center space-x-4 sm:mt-0">
                            <a
                                href="https://github.com/motz0815/songup"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-white hover:text-gray-200"
                            >
                                <FaGithub className="size-5" />
                                <span className="text-sm">
                                    Open Source on GitHub
                                </span>
                            </a>
                            <a
                                href="/discord"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-white hover:text-gray-200"
                            >
                                <FaDiscord className="size-5" />
                                <span className="text-sm">Join Discord</span>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
