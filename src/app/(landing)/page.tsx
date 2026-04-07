import { DemoSection } from "@/components/landing/demo-section"
import { JoinRoomForm } from "@/components/room/join-room"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, MessageSquareQuote, PartyPopper, Sparkles } from "lucide-react"
import { Metadata, Viewport } from "next"
import Link from "next/link"
import { FaDiscord, FaGithub } from "react-icons/fa"
import { LandingBackground } from "../background"

export const metadata: Metadata = {
    title: "SongUp - Open source shared music queue for parties",
}

export const viewport: Viewport = {
    themeColor: "#000000",
    colorScheme: "dark",
}

export default function Home() {
    return (
        <>
            <LandingBackground />
            <div className="flex min-h-screen flex-col items-center text-white">
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
                                <div className="flex flex-col items-center gap-4 md:items-stretch">
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
                                    <JoinRoomForm />
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

                    {/* Social Proof */}
                    <section className="w-full py-12 md:py-24">
                        <div className="container px-4 md:px-6">
                            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Users love SongUp.
                            </h2>
                            {/* Stats */}
                            <div className="mb-16 grid grid-cols-1 divide-y divide-white/10 rounded-xl border border-white/20 bg-white/5 backdrop-blur-lg sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                                {[
                                    { value: "000", label: "GitHub Stars" },
                                    {
                                        value: "000",
                                        label: "Rooms Created",
                                    },
                                    {
                                        value: "000",
                                        label: "Songs Added / Month",
                                    },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="flex flex-col items-center gap-1 px-6 py-8"
                                    >
                                        <span className="text-4xl font-bold tracking-tight">
                                            {stat.value}
                                        </span>
                                        <span className="text-sm text-white/60">
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Quotes */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {[
                                    {
                                        quote: "Your quote here.",
                                        author: "Name",
                                        role: "Role / Context",
                                    },
                                    {
                                        quote: "Your quote here.",
                                        author: "Name",
                                        role: "Role / Context",
                                    },
                                    {
                                        quote: "Your quote here.",
                                        author: "Name",
                                        role: "Role / Context",
                                    },
                                ].map((testimonial, i) => (
                                    <Card
                                        key={i}
                                        className="border-white/20 bg-white/5 text-white backdrop-blur-lg"
                                    >
                                        <CardContent className="flex flex-col gap-4">
                                            <MessageSquareQuote className="size-6 text-white/30" />
                                            <p className="text-sm leading-relaxed text-white/80 italic">
                                                &ldquo;{testimonial.quote}
                                                &rdquo;
                                            </p>
                                            <div className="mt-auto">
                                                <p className="text-sm font-medium">
                                                    {testimonial.author}
                                                </p>
                                                <p className="text-xs text-white/50">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Demo Videos */}
                    <DemoSection />

                    {/* Use Cases */}
                    <section
                        id="parties"
                        className="w-full py-12 md:py-24 lg:py-32"
                    >
                        <div className="container px-4 md:px-6">
                            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                                <div>
                                    <PartyPopper className="mb-4 size-10" />
                                    <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                        The party DJ everyone deserves
                                    </h2>
                                    <p className="mb-6 text-lg text-white/70">
                                        No more one person hogging the speaker
                                        all night. With SongUp, every guest gets
                                        a say in the playlist. The host shows
                                        the queue on a TV while guests add songs
                                        from their phones.
                                    </p>
                                    <ul className="flex flex-col gap-3">
                                        {[
                                            "Fair queue — everyone adds up to 2 songs at a time",
                                            "QR code on screen for instant joining",
                                            "No app download or sign-up needed",
                                        ].map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-2 text-white/80"
                                            >
                                                <Check className="mt-0.5 size-5 shrink-0 text-green-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex aspect-video items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-lg">
                                    <span className="text-sm text-white/40">
                                        party-illustration.png
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="gatherings"
                        className="w-full py-12 md:py-24 lg:py-32"
                    >
                        <div className="container px-4 md:px-6">
                            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                                <div className="order-2 flex aspect-video items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-lg md:order-1">
                                    <span className="text-sm text-white/40">
                                        gathering-illustration.png
                                    </span>
                                </div>
                                <div className="order-1 md:order-2">
                                    <Sparkles className="mb-4 size-10" />
                                    <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                        Perfect for any gathering
                                    </h2>
                                    <p className="mb-6 text-lg text-white/70">
                                        Team events, watch parties, barbecues —
                                        whenever a group wants shared music,
                                        SongUp keeps it collaborative and fun.
                                        Everyone feels included, no awkward
                                        phone hand-offs.
                                    </p>
                                    <ul className="flex flex-col gap-3">
                                        {[
                                            "Works on any device with a browser",
                                            "Real-time sync across all connected guests",
                                            "Host stays in control with skip & remove",
                                        ].map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-2 text-white/80"
                                            >
                                                <Check className="mt-0.5 size-5 shrink-0 text-green-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section
                        id="pricing"
                        className="w-full py-12 md:py-24 lg:py-32"
                    >
                        <div className="container px-4 md:px-6">
                            <h2 className="mb-4 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Simple, transparent pricing
                            </h2>
                            <p className="mx-auto mb-12 max-w-2xl text-center text-white/70">
                                Start for free. Upgrade when you need more.
                            </p>

                            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                                <Card className="border-white/20 bg-white/10 text-white shadow-md backdrop-blur-lg">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-shadow-md">
                                            Free
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <p className="text-4xl font-bold">
                                            $0
                                            <span className="text-base font-normal text-white/60">
                                                {" "}
                                                / forever
                                            </span>
                                        </p>
                                        <ul className="flex flex-col gap-2 text-white/80">
                                            {[
                                                "1 room at a time",
                                                "Up to 10 guests",
                                                "YouTube playback",
                                                "QR code sharing",
                                            ].map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Check className="size-4 text-green-400" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href="/host">
                                            <Button
                                                variant="outline"
                                                className="mt-2 w-full border-white/20"
                                            >
                                                Get started
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                <Card className="border-purple-400/40 bg-white/15 text-white shadow-lg shadow-purple-500/10 backdrop-blur-lg">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-shadow-md">
                                            Pro
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <p className="text-4xl font-bold">
                                            $5
                                            <span className="text-base font-normal text-white/60">
                                                {" "}
                                                / month
                                            </span>
                                        </p>
                                        <ul className="flex flex-col gap-2 text-white/80">
                                            {[
                                                "Unlimited rooms",
                                                "Unlimited guests",
                                                "Priority queue support",
                                                "Custom room branding",
                                            ].map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Check className="size-4 text-green-400" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href="/host">
                                            <Button className="mt-2 w-full border border-white/20">
                                                Upgrade to Pro
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>
                </main>
                <footer className="w-full border-t border-white/20 px-4 py-6 md:px-6">
                    <div className="flex flex-col items-center justify-between sm:flex-row">
                        <div>
                            <span className="flex gap-2 text-xs text-white/80">
                                <span>
                                    Made with ❤️ by{" "}
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                        href="https://github.com/motz0815"
                                    >
                                        matthias
                                    </a>
                                </span>
                                <a
                                    className="underline"
                                    href="/docs/legal/terms"
                                >
                                    Terms of Service
                                </a>
                                <a
                                    className="underline"
                                    href="/docs/legal/privacy"
                                >
                                    Privacy
                                </a>
                                <a
                                    className="underline"
                                    href="/docs/legal/imprint"
                                >
                                    Imprint
                                </a>
                            </span>
                        </div>

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
