import { LandingBackground } from "@/app/background"
import { BrandMark } from "@/components/brand/brand-mark"
import { RoomCode } from "@/components/brand/room-code"
import { TallyField } from "@/components/brand/tally-field"
import { JoinRoomForm } from "@/components/room/join-room"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUpRight } from "lucide-react"
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

                <main className="mx-auto flex w-full max-w-7xl flex-1 items-center py-14 sm:py-20">
                    <div className="w-full">
                        <h1 className="font-display animate-rise-in text-[clamp(3.25rem,14vw,12rem)] leading-[0.72] font-extrabold tracking-[-0.085em]">
                            Democra<span className="text-signal">Tune</span>
                        </h1>
                        <div className="mt-8 grid gap-8 border-t-2 border-white/70 pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                            <div>
                                <h2 className="font-display max-w-4xl text-4xl leading-[0.92] font-bold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
                                    Never fight over the aux again.
                                </h2>
                                <p className="mt-5 max-w-xl text-lg text-white/72 sm:text-xl">
                                    One live queue for the whole room. Add a
                                    track, vote together, take the night home.
                                </p>
                            </div>
                            <div className="w-full lg:justify-self-end">
                                <JoinRoomForm variant="landing" />
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="font-code text-xs tracking-[0.18em] text-white/50 uppercase">
                                        or
                                    </span>
                                    <Button
                                        asChild
                                        variant="link"
                                        className="h-auto p-0 text-base font-bold text-white underline decoration-2 underline-offset-4 hover:text-white/75"
                                    >
                                        <Link href="/host">
                                            Host your own room
                                            <ArrowUpRight className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <a
                    href="#how-it-works"
                    className="flex w-fit items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
                >
                    See how the room decides <ArrowDown className="size-4" />
                </a>
            </section>

            <main id="how-it-works" className="bg-paper text-ink">
                <section className="paper-field px-5 py-24 sm:px-10 lg:py-32">
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="font-code text-broadcast text-xs font-bold tracking-[0.2em] uppercase">
                                01 · Join
                            </p>
                            <h2 className="font-display mt-4 text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-7xl">
                                Four characters. Everyone is in.
                            </h2>
                            <p className="text-ink/65 mt-6 max-w-xl text-lg">
                                Put the code on the host screen. Guests join
                                from any phone, choose a nickname, and start
                                adding music—no account required.
                            </p>
                        </div>
                        <div className="poster-rule text-broadcast flex min-h-72 items-center justify-center py-12">
                            <RoomCode code="AB7K" label="Tonight’s room" />
                        </div>
                    </div>
                </section>

                <section className="bg-broadcast px-5 py-24 text-white sm:px-10 lg:py-32">
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                        <div className="order-2 h-72 text-white/35 lg:order-1 lg:h-96">
                            <TallyField />
                        </div>
                        <div className="order-1 lg:order-2">
                            <p className="font-code text-xs font-bold tracking-[0.2em] text-white/65 uppercase">
                                02 · Decide
                            </p>
                            <h2 className="font-display mt-4 text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-7xl">
                                The queue listens to the room.
                            </h2>
                            <p className="mt-6 max-w-xl text-lg text-white/75">
                                Fair schedulers share the turns. Votes shape
                                what comes next, and enough downvotes end a song
                                early.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="px-5 py-24 sm:px-10 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <p className="font-code text-signal text-xs font-bold tracking-[0.2em] uppercase">
                            03 · Keep it
                        </p>
                        <div className="border-ink mt-4 grid gap-8 border-t-2 pt-6 lg:grid-cols-2">
                            <h2 className="font-display text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-7xl">
                                The night ends. The playlist doesn’t.
                            </h2>
                            <p className="text-ink/65 max-w-xl text-lg lg:pt-2">
                                Open each track on the service you use, or send
                                the full room history to a private Spotify
                                playlist straight from your browser.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-night border-t border-white/15 px-5 py-8 sm:px-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <BrandMark compact className="text-2xl" />
                        <p className="mt-2 text-sm text-white/55">
                            Built by Tim Kolesnichenko from the original SongUp
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
