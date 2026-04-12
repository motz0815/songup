import { DemoSection } from "@/components/landing/demo-section"
import { Stats } from "@/components/landing/stats"
import { JoinRoomForm } from "@/components/room/join-room"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, MessageSquareQuote, PartyPopper, Sparkles } from "lucide-react"
import { Metadata, Viewport } from "next"
import Image from "next/image"
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

                    {/* Demo Videos */}
                    <DemoSection />

                    {/* Social Proof */}
                    <section className="w-full py-12 md:py-24">
                        <div className="container px-4 md:px-6">
                            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Users love SongUp.
                            </h2>
                            {/* Stats */}
                            <Stats />

                            {/* Quotes */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {[
                                    {
                                        quote: "I was able to get it running quickly and queue up some YouTube songs, and will use it for my next party!",
                                        author: "Traun Leyden",
                                        src: "https://ph-avatars.imgix.net/4621187/e889ad71-1fe0-4fe0-88fb-6dfe8b74a7d0.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=32&h=32&fit=crop&frame=1&dpr=2",
                                        role: "On ProductHunt",
                                        href: "https://www.producthunt.com/products/songup?comment=4338038",
                                    },
                                    {
                                        quote: "Really cool! Love how intuitive the UI is.",
                                        author: "OwnIntroduction8326",
                                        src: "https://styles.redditmedia.com/t5_a3u16e/styles/profileIcon_snoo-nftv2_bmZ0X2VpcDE1NToxMzdfZWI5NTlhNzE1ZGZmZmU2ZjgyZjQ2MDU1MzM5ODJjNDg1OWNiMTRmZV8yMzgyNjcyNQ_rare_7b725bf1-11ed-4a56-afe1-794e0eabc221-headshot.png?width=64&height=64&frame=1&auto=webp&crop=64%3A64%2Csmart&s=a9238ca4e998fa82125e1a9863f72f560ba483f4",
                                        role: "On Reddit",
                                        href: "https://www.reddit.com/r/webdev/comments/1i9iygo/comment/m94gz5y/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
                                    },
                                    {
                                        quote: "Oh this is great, I've wanted this exact thing for years!!!",
                                        author: "ic_nay",
                                        src: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
                                        role: "On Reddit",
                                        href: "https://www.reddit.com/r/webdev/comments/1i9iygo/comment/m94jof6/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
                                    },
                                ].map((testimonial, i) => (
                                    <Card
                                        key={i}
                                        className="border-white/20 bg-white/5 text-white backdrop-blur-lg"
                                    >
                                        <CardContent className="flex flex-col gap-4">
                                            {testimonial.src ? (
                                                <Avatar>
                                                    <AvatarImage
                                                        src={testimonial.src}
                                                        alt={testimonial.author}
                                                    />
                                                    <AvatarFallback>
                                                        {testimonial.author.charAt(
                                                            0,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <MessageSquareQuote className="size-6 text-white/30" />
                                            )}
                                            <p className="text-sm leading-relaxed text-white/80 italic">
                                                &ldquo;{testimonial.quote}
                                                &rdquo;
                                            </p>
                                            <div className="mt-auto">
                                                <p className="text-sm font-medium">
                                                    {testimonial.author}
                                                </p>
                                                <a
                                                    href={testimonial.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <p className="text-xs text-white/50">
                                                        {testimonial.role}
                                                    </p>
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

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
                                            "Fair queue — everyone adds up to 2 (configurable) songs at a time",
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
                                    <Image
                                        src="/songup-host.png"
                                        alt="SongUp host view"
                                        width={1280}
                                        height={720}
                                        className="object-cover"
                                    />
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
                                    <Image
                                        src="/songup-host-2.png"
                                        alt="SongUp host view"
                                        width={1280}
                                        height={720}
                                        className="object-cover"
                                    />
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
                                            "Fallback playlist plays while no one adds anything",
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
                                It's free. You don't even need to log in.
                            </h2>
                            <p className="mx-auto mb-12 max-w-2xl text-center text-white/70">
                                You can create an unlimited number of free
                                rooms. Buy a Pro Room (one-time payment) if you
                                need more features.
                            </p>

                            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                                <Card className="border-white/20 bg-white/10 text-white shadow-md backdrop-blur-lg">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-shadow-md">
                                            Free Room
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex h-full flex-col justify-between gap-4">
                                        <div className="flex flex-col gap-4">
                                            <p className="text-4xl font-bold">
                                                0€
                                                <span className="text-base font-normal text-white/60">
                                                    {" "}
                                                    / room
                                                </span>
                                            </p>
                                            <ul className="flex flex-col gap-2 text-white/80">
                                                {[
                                                    "Unlimited guests",
                                                    "Fallback playlist (up to 50 songs)",
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
                                        </div>
                                        <Link href="/host">
                                            <Button
                                                variant="secondary"
                                                className="mt-2 w-full"
                                            >
                                                Create a free room
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                <Card className="border-purple-400/40 bg-white/15 text-white shadow-lg shadow-purple-500/10 backdrop-blur-lg">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-shadow-md">
                                            Pro Room
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex h-full flex-col justify-between gap-4">
                                        <div className="flex flex-col gap-4">
                                            <p className="text-4xl font-bold">
                                                5€
                                                <span className="text-base font-normal text-white/60">
                                                    {" "}
                                                    / room
                                                </span>
                                            </p>
                                            <ul className="flex flex-col gap-2 text-white/80">
                                                {[
                                                    "Unlimited guests",
                                                    "Fallback playlist (unlimited songs)",
                                                    "Advanced queue controls",
                                                    "Control the room from your mobile device",
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
                                        </div>
                                        <Link href="/host">
                                            <Button className="mt-2 w-full border border-white/20">
                                                Create a Pro room
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
