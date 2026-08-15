import { LandingBackground } from "@/app/background"
import { BrandMark } from "@/components/brand/brand-mark"
import { TallyField } from "@/components/brand/tally-field"
import { JoinRoomForm } from "@/components/room/join-room"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    ArrowRight,
    ArrowUpRight,
    History,
    ListMusic,
    QrCode,
    Scale,
    ThumbsUp,
    type LucideIcon,
} from "lucide-react"
import { Metadata, Viewport } from "next"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"

export const metadata: Metadata = {
    title: "DemocraTune - Open source shared music queue for parties",
}

export const viewport: Viewport = {
    themeColor: "#0c1519",
    colorScheme: "dark",
}

export default function Home() {
    return (
        <div className="bg-night text-white">
            <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden px-5 py-6 sm:px-10 sm:py-8">
                <LandingBackground />
                <div className="halftone-field pointer-events-none absolute inset-0 -z-[5] [mask-image:linear-gradient(to_bottom,black,transparent_80%)] text-white/10" />

                <header className="flex items-center justify-between">
                    <Link href="/" aria-label="DemocraTune home">
                        <BrandMark compact className="text-2xl sm:text-3xl" />
                    </Link>
                    <Link
                        href="https://github.com/KOLESNiii/DemocraTune/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
                    >
                        <FaGithub className="size-5" />
                        <span className="hidden sm:inline">Open source</span>
                    </Link>
                </header>

                <main className="mx-auto flex w-full max-w-7xl flex-1 items-center py-12 sm:py-20">
                    <div className="w-full">
                        <h1 className="font-display animate-rise-in text-[clamp(3.25rem,14vw,12rem)] leading-[0.72] font-extrabold tracking-[-0.085em]">
                            Democra<span className="text-signal">Tune</span>
                        </h1>

                        <div className="mt-8 grid gap-10 border-t-2 border-white/70 pt-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                            <div>
                                <h2 className="font-display max-w-3xl text-4xl leading-[0.92] font-bold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
                                    Everyone gets a turn on the aux.
                                </h2>
                                <p className="mt-5 max-w-xl text-lg text-white/75 sm:text-xl">
                                    Start one shared music queue for the room.
                                    Guests add songs from their phones, vote on
                                    what is playing, and take fair turns—without
                                    making an account.
                                </p>
                            </div>

                            <div className="w-full lg:max-w-2xl lg:justify-self-end">
                                <Link
                                    href="/host"
                                    className="group border-signal bg-signal flex min-h-28 items-center justify-between gap-5 border-2 px-5 py-6 text-white shadow-[8px_8px_0_0_rgba(255,255,255,0.9)] transition-transform hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none sm:min-h-36 sm:px-8"
                                >
                                    <span>
                                        <span className="font-display block text-3xl leading-none font-extrabold tracking-[-0.045em] sm:text-5xl">
                                            Host your own room
                                        </span>
                                        <span className="mt-3 block text-base text-white/80 sm:text-lg">
                                            Start a shared queue and put it on
                                            the big screen.
                                        </span>
                                    </span>
                                    <ArrowUpRight className="size-8 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 sm:size-10" />
                                </Link>

                                <div className="mt-8 border-t border-white/35 pt-6">
                                    <p className="mb-3 text-base font-semibold text-white/80">
                                        Joining someone else’s room?
                                    </p>
                                    <JoinRoomForm variant="landing" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </section>

            <main className="bg-paper text-ink">
                <section className="paper-field px-5 py-20 sm:px-10 lg:py-28">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                            <h2 className="font-display max-w-4xl text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-7xl">
                                One room, one queue, no gatekeeping.
                            </h2>
                            <p className="text-ink/65 max-w-xl text-lg lg:justify-self-end">
                                DemocraTune gives the host a big-screen player
                                and gives everyone else a simple phone view.
                                There is nothing to install and no account wall
                                before the music starts.
                            </p>
                        </div>

                        <ol className="border-ink mt-14 grid border-y-2 md:grid-cols-3">
                            <li className="border-ink py-7 md:border-r-2 md:px-7 md:first:pl-0">
                                <span className="text-broadcast font-display text-4xl font-extrabold">
                                    1
                                </span>
                                <h3 className="font-display mt-4 text-2xl font-extrabold tracking-[-0.035em]">
                                    Start a room
                                </h3>
                                <p className="text-ink/60 mt-2">
                                    Open the host screen and get a QR code for
                                    everyone nearby.
                                </p>
                            </li>
                            <li className="border-ink border-t-2 py-7 md:border-t-0 md:border-r-2 md:px-7">
                                <span className="text-broadcast font-display text-4xl font-extrabold">
                                    2
                                </span>
                                <h3 className="font-display mt-4 text-2xl font-extrabold tracking-[-0.035em]">
                                    Add songs together
                                </h3>
                                <p className="text-ink/60 mt-2">
                                    Guests join from any phone and add tracks to
                                    the same live queue.
                                </p>
                            </li>
                            <li className="border-ink border-t-2 py-7 md:border-t-0 md:px-7 md:last:pr-0">
                                <span className="text-broadcast font-display text-4xl font-extrabold">
                                    3
                                </span>
                                <h3 className="font-display mt-4 text-2xl font-extrabold tracking-[-0.035em]">
                                    Let the room decide
                                </h3>
                                <p className="text-ink/60 mt-2">
                                    Votes shape playback while fair scheduling
                                    stops one person taking over.
                                </p>
                            </li>
                        </ol>
                    </div>
                </section>

                <section className="bg-broadcast px-5 py-20 text-white sm:px-10 lg:py-28">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
                            <h2 className="font-display max-w-4xl text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-7xl">
                                Built for the whole night.
                            </h2>
                            <p className="max-w-xl text-lg text-white/75 lg:justify-self-end">
                                Every action updates in real time: songs arrive,
                                votes change, and fair turns move through the
                                queue.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                            <div className="bg-night relative min-h-[32rem] overflow-hidden border-2 border-white/45 p-5 shadow-[12px_12px_0_0_#ff593d] sm:p-8">
                                <div className="halftone-field pointer-events-none absolute inset-0 text-white/10" />
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[repeating-linear-gradient(to_top,transparent_0,transparent_3.9rem,rgba(255,255,255,0.08)_4rem)]" />
                                <div className="text-broadcast pointer-events-none absolute inset-x-0 bottom-0 h-3/4 opacity-90">
                                    <TallyField />
                                </div>
                                <div className="text-signal pointer-events-none absolute inset-x-3 bottom-0 h-1/2 opacity-30 mix-blend-screen blur-[1px]">
                                    <TallyField />
                                </div>
                                <div className="from-night via-night/70 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent" />

                                <div className="relative z-10 flex min-h-[28rem] flex-col">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h3 className="font-display text-3xl font-extrabold tracking-[-0.04em]">
                                            Example room
                                        </h3>
                                        <span className="flex items-center gap-2 text-sm font-semibold text-white/70">
                                            <span className="bg-signal size-2.5 animate-pulse rounded-full motion-reduce:animate-none" />
                                            8 people listening
                                        </span>
                                    </div>

                                    <div className="border-ink bg-paper text-ink mt-8 shadow-[8px_8px_0_0_#0878ff]">
                                        <div className="border-ink flex items-center justify-between border-b-2 px-4 py-3">
                                            <span className="font-semibold">
                                                Up next
                                            </span>
                                            <span className="text-ink/55 text-sm">
                                                Fair turns on
                                            </span>
                                        </div>
                                        <div className="divide-ink/20 divide-y">
                                            <QueuePreview
                                                position="1"
                                                title="Once in a Lifetime"
                                                artist="Talking Heads"
                                                vote="+6"
                                            />
                                            <QueuePreview
                                                position="2"
                                                title="Electric Feel"
                                                artist="MGMT"
                                                vote="+4"
                                            />
                                            <QueuePreview
                                                position="3"
                                                title="Midnight City"
                                                artist="M83"
                                                vote="+3"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-auto grid grid-cols-3 gap-2 pt-8 text-center text-sm font-semibold">
                                        <span className="border border-white/30 bg-black/45 px-2 py-2">
                                            Songs added
                                        </span>
                                        <span className="border border-white/30 bg-black/45 px-2 py-2">
                                            Votes cast
                                        </span>
                                        <span className="border border-white/30 bg-black/45 px-2 py-2">
                                            Turns shared
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                                <Capability
                                    icon={QrCode}
                                    title="Join instantly"
                                >
                                    Scan the host screen or enter the short room
                                    code. No login, download, or invite list.
                                </Capability>
                                <Capability
                                    icon={ListMusic}
                                    title="Build one queue"
                                >
                                    Everyone can search and add music from their
                                    own phone without passing one device around.
                                </Capability>
                                <Capability
                                    icon={Scale}
                                    title="Share the turns"
                                >
                                    Choose first-come-first-served, round-robin,
                                    or a weighted fair scheduler for the room.
                                </Capability>
                                <Capability
                                    icon={ThumbsUp}
                                    title="Vote together"
                                >
                                    Upvote what is playing. Enough downvotes
                                    skip a track without one person playing DJ.
                                </Capability>
                                <Capability
                                    icon={History}
                                    title="Keep the playlist"
                                    className="sm:col-span-2 xl:col-span-1"
                                >
                                    Reopen played tracks on your music service
                                    or export the room history to Spotify.
                                </Capability>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="paper-field px-5 py-20 sm:px-10 lg:py-28">
                    <div className="border-ink mx-auto grid max-w-7xl gap-8 border-y-2 py-10 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <h2 className="font-display text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-7xl">
                                Start the room.
                            </h2>
                            <p className="text-ink/60 mt-4 max-w-2xl text-lg">
                                Put DemocraTune on the big screen and let
                                everyone help choose what plays next.
                            </p>
                        </div>
                        <Button
                            asChild
                            className="border-ink bg-signal hover:bg-signal/90 h-16 w-full rounded-none border-2 px-7 text-lg font-bold text-white shadow-[6px_6px_0_0_#111512] lg:w-auto"
                        >
                            <Link href="/host">
                                Host your own room
                                <ArrowRight className="size-5" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>

            <footer className="bg-night border-t border-white/15 px-5 py-8 sm:px-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <BrandMark compact className="text-2xl" />
                        <a
                            href="https://www.timkolesnichenko.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-display mt-4 inline-flex items-center gap-2 text-xl font-extrabold tracking-[-0.025em] text-white transition-colors hover:text-white/70"
                        >
                            Created by Tim Kolesnichenko
                            <ArrowUpRight className="size-5" />
                        </a>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                            Based on the original{" "}
                            <a
                                href="https://github.com/motz0815/songup"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-white/35 underline-offset-4 hover:text-white"
                            >
                                SongUp
                            </a>{" "}
                            project by Matthias.
                        </p>
                    </div>
                    <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/70">
                        <Link href="/privacy" className="hover:text-white">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-white">
                            Terms
                        </Link>
                        <Link
                            href="https://github.com/KOLESNiii/DemocraTune/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white"
                        >
                            GitHub
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}

function QueuePreview({
    position,
    title,
    artist,
    vote,
}: {
    position: string
    title: string
    artist: string
    vote: string
}) {
    return (
        <div className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-4 py-4">
            <span className="font-display text-ink/35 text-2xl font-extrabold">
                {position}
            </span>
            <div className="min-w-0">
                <p className="truncate font-semibold">{title}</p>
                <p className="text-ink/55 truncate text-sm">{artist}</p>
            </div>
            <span className="bg-vote-up px-2 py-1 text-sm font-bold text-white tabular-nums">
                {vote}
            </span>
        </div>
    )
}

function Capability({
    icon: Icon,
    title,
    children,
    className,
}: {
    icon: LucideIcon
    title: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <article
            className={cn(
                "border-2 border-white/35 bg-white/10 p-5",
                className,
            )}
        >
            <Icon className="size-6 text-white" />
            <h3 className="font-display mt-5 text-2xl font-extrabold tracking-[-0.035em]">
                {title}
            </h3>
            <p className="mt-2 leading-relaxed text-white/70">{children}</p>
        </article>
    )
}
