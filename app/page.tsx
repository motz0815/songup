import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Github, Music, Tv, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { joinRoom } from "./actions"

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
            <main className="flex-1 text-white">
                <section className="w-full py-12 lg:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <a
                                href="https://www.producthunt.com/posts/songup?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-songup"
                                target="_blank"
                            >
                                <Image
                                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=815261&theme=light&t=1737710612129"
                                    alt="SongUp - Open&#0032;Source&#0032;shared&#0032;music&#0032;queue&#0032;for&#0032;parties&#0046; | Product Hunt"
                                    style={{ width: "250px", height: "54px" }}
                                    width="250"
                                    height="54"
                                />
                            </a>
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                                Never fight over the aux again.
                            </h1>
                            <Image
                                src="/songup-host.png"
                                width={1920}
                                height={1080}
                                alt="SongUp Host"
                            />
                            <p className="mx-auto max-w-[700px] md:text-xl">
                                Shared party music queueing made easy. <br />{" "}
                                Open source, no login required, just create a
                                room and let the party begin!
                            </p>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Link href="/host">
                                    <Button>Host a room</Button>
                                </Link>
                                <form action={joinRoom}>
                                    <div className="flex gap-2">
                                        <Input
                                            name="code"
                                            placeholder="Enter room code"
                                            className="bg-background text-foreground"
                                            required
                                        />
                                        <SubmitButton>Join room</SubmitButton>
                                    </div>
                                </form>
                            </div>
                            <a
                                href="https://github.com/motz0815/songup"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-white hover:text-gray-200"
                            >
                                <Github className="h-5 w-5" />
                                <span>View on GitHub</span>
                            </a>
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
                                    Host page designed for a central TV, showing
                                    the YouTube player, queue, and room QR code.
                                </CardContent>
                            </Card>
                            <Card className="border-white/20 bg-white/10 text-white shadow-md backdrop-blur-lg">
                                <CardHeader>
                                    <Users className="mb-2 h-8 w-8" />
                                    <CardTitle>Collaborative Queuing</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Party members can add up to 2 songs at once
                                    to the main queue using their devices.
                                </CardContent>
                            </Card>
                            <Card className="border-white/20 bg-white/10 text-white shadow-md backdrop-blur-lg">
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
            <footer className="w-full border-t border-white/20 px-4 py-6 md:px-6">
                <div className="container flex flex-col items-center justify-between sm:flex-row">
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
                            <Github className="h-5 w-5" />
                            <span className="text-sm">
                                Open Source on GitHub
                            </span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
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
