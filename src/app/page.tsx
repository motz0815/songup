import { LandingBackground } from "@/app/background"
import { BrandMark } from "@/components/brand/brand-mark"
import { TallyField } from "@/components/brand/tally-field"
import { JoinRoomForm } from "@/components/room/join-room"
import { ArrowUpRight } from "lucide-react"
import { Metadata, Viewport } from "next"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"

export const metadata: Metadata = {
    title: {
        absolute: "DemocraTune — Free shared music queue for parties",
    },
    alternates: { canonical: "/" },
}
export const viewport: Viewport = {
    themeColor: "#0c1519",
    colorScheme: "dark",
}

export default function Home() {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://democratune.timkolesnichenko.me/#website",
                url: "https://democratune.timkolesnichenko.me/",
                name: "DemocraTune",
                description:
                    "A free, open-source shared music queue for parties.",
                inLanguage: "en-GB",
                creator: {
                    "@id": "https://www.timkolesnichenko.me/#person",
                },
            },
            {
                "@type": "WebApplication",
                "@id": "https://democratune.timkolesnichenko.me/#application",
                name: "DemocraTune",
                url: "https://democratune.timkolesnichenko.me/",
                description:
                    "Create a shared party music queue where guests scan a QR code to request songs, vote, and take fair turns without accounts or downloads.",
                applicationCategory: "MultimediaApplication",
                operatingSystem: "Any",
                browserRequirements: "Requires a modern web browser",
                isAccessibleForFree: true,
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "GBP",
                },
                featureList: [
                    "QR code and four-character room joining",
                    "Shared song search and queue",
                    "First-come-first-served, round-robin, and rating-weighted scheduling",
                    "Song voting and group skips",
                    "Fallback playlists",
                    "Play history and Spotify playlist export",
                ],
                codeRepository: "https://github.com/KOLESNiii/DemocraTune",
                license: "https://www.gnu.org/licenses/agpl-3.0.html",
                creator: {
                    "@id": "https://www.timkolesnichenko.me/#person",
                },
            },
            {
                "@type": "Person",
                "@id": "https://www.timkolesnichenko.me/#person",
                name: "Tim Kolesnichenko",
                url: "https://www.timkolesnichenko.me/",
                sameAs: ["https://github.com/KOLESNiii"],
            },
        ],
    }

    return (
        <div className="bg-night text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(
                        /</g,
                        "\\u003c",
                    ),
                }}
            />
            <section className="relative isolate overflow-hidden px-5 py-6 sm:px-10 sm:py-8">
                <LandingBackground />
                <div className="halftone-field pointer-events-none absolute inset-0 -z-[5] [mask-image:linear-gradient(to_bottom,black,transparent_85%)] text-white/10" />

                <header className="flex items-center justify-between">
                    <Link href="/" aria-label="DemocraTune home">
                        <BrandMark compact className="text-2xl sm:text-3xl" />
                    </Link>
                    <nav className="flex items-center gap-5 text-sm font-semibold text-white/75">
                        <Link
                            href="/about"
                            className="transition-colors hover:text-white"
                        >
                            About
                        </Link>
                        <Link
                            href="https://github.com/KOLESNiii/DemocraTune/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 transition-colors hover:text-white"
                        >
                            <FaGithub className="size-5" />
                            <span className="hidden sm:inline">
                                Open source
                            </span>
                        </Link>
                    </nav>
                </header>

                <main className="mx-auto w-full max-w-7xl pt-12 pb-14 sm:pt-16 sm:pb-20">
                    <h1 className="font-display animate-rise-in text-[clamp(3.25rem,13vw,10rem)] leading-[0.72] font-extrabold tracking-[-0.085em]">
                        Democra<span className="text-signal">Tune</span>
                    </h1>

                    <div className="mt-7 grid gap-7 border-t-2 border-white/70 pt-6 sm:mt-8 sm:gap-8 sm:pt-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                        <div>
                            <h2 className="font-display max-w-3xl text-4xl leading-[0.92] font-bold tracking-[-0.055em] text-balance sm:text-6xl">
                                The shared party queue where everyone gets a
                                turn.
                            </h2>
                            <p className="mt-4 max-w-xl text-lg text-white/75">
                                Guests scan a QR code to request songs from
                                their phones, vote together, and take fair
                                turns. No accounts or app downloads.
                            </p>
                        </div>

                        <div className="w-full lg:max-w-2xl lg:justify-self-end">
                            <Link
                                href="/host"
                                className="group border-signal bg-signal flex min-h-24 items-center justify-between gap-5 border-2 px-5 py-5 text-white shadow-[8px_8px_0_0_rgba(255,255,255,0.9)] transition-transform hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none sm:min-h-28 sm:px-7"
                            >
                                <span>
                                    <span className="font-display block text-3xl leading-none font-extrabold tracking-[-0.045em] sm:text-4xl">
                                        Host your own room
                                    </span>
                                    <span className="mt-2 block text-base text-white/80">
                                        Start a free room in seconds.
                                    </span>
                                </span>
                                <ArrowUpRight className="size-8 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>

                            <div className="mt-6 border-t border-white/35 pt-5">
                                <p className="mb-3 font-semibold text-white/80">
                                    Joining an existing room?
                                </p>
                                <JoinRoomForm variant="landing" />
                            </div>
                        </div>
                    </div>
                </main>
            </section>

            <main className="paper-field text-ink px-5 py-12 sm:px-10 sm:py-20">
                <section className="mx-auto max-w-7xl">
                    <div className="border-ink grid gap-5 border-b-2 pb-7 lg:grid-cols-[1fr_0.8fr] lg:items-end">
                        <h2 className="font-display text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-7xl">
                            Everything the room can do.
                        </h2>
                        <p className="text-ink/65 max-w-xl text-lg lg:justify-self-end">
                            A big-screen player for the host and a fast phone
                            interface for everyone choosing the music.
                        </p>
                    </div>

                    <div className="mt-7 grid gap-7 sm:mt-8 sm:gap-8 xl:grid-cols-[0.72fr_1.28fr]">
                        <div className="bg-night border-ink relative min-h-64 overflow-hidden border-2 text-white shadow-[6px_6px_0_0_#ff593d] sm:min-h-72 sm:shadow-[8px_8px_0_0_#ff593d] xl:min-h-full">
                            <div className="halftone-field pointer-events-none absolute inset-0 text-white/10" />
                            <div className="text-broadcast pointer-events-none absolute inset-x-0 bottom-0 h-4/5 opacity-90">
                                <TallyField />
                            </div>
                            <div className="text-signal pointer-events-none absolute inset-x-2 bottom-0 h-1/2 opacity-35 mix-blend-screen blur-[1px]">
                                <TallyField />
                            </div>
                            <div className="from-night via-night/55 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent" />

                            <div className="relative z-10 flex min-h-64 flex-col justify-between p-5 sm:min-h-72 sm:p-7 xl:min-h-full">
                                <div>
                                    <h3 className="font-display text-3xl font-extrabold tracking-[-0.04em]">
                                        The room moves live.
                                    </h3>
                                    <p className="mt-2 max-w-sm text-white/65">
                                        Songs, votes, and turns update for
                                        everyone as they happen.
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <strong className="border border-white/35 bg-black/50 px-2 py-3">
                                        Add
                                    </strong>
                                    <strong className="border border-white/35 bg-black/50 px-2 py-3">
                                        Vote
                                    </strong>
                                    <strong className="border border-white/35 bg-black/50 px-2 py-3">
                                        Play
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <ul className="border-ink grid grid-cols-2 border-t-2">
                            <Capability
                                title="Guest requests by QR code"
                                description="Join from any phone and request songs. No account, invite list, or download."
                            />
                            <Capability
                                title="Dedicated host screen"
                                description="A large-screen player shows what is playing, what is next, and how to join."
                            />
                            <Capability
                                title="Collaborative party queue"
                                description="Everyone can search and add tracks, with a queue limit for each guest."
                            />
                            <Capability
                                title="Three fair schedulers"
                                description="Choose first-come-first-served, round-robin, or rating-weighted DemocraSchedule."
                            />
                            <Capability
                                title="Voting and group skips"
                                description="Upvote or downvote the current song. Hosts choose the live-listener skip threshold."
                            />
                            <Capability
                                title="Room ratings"
                                description="Votes can shape future turns, with an optional window for how long ratings count."
                            />
                            <Capability
                                title="Fallback music"
                                description="A host playlist fills quiet moments while guest requests always stay first."
                            />
                            <Capability
                                title="History and service links"
                                description="See every played track and reopen it on Spotify, Tidal, Deezer, Amazon Music, and more."
                            />
                            <Capability
                                title="Spotify playlist export"
                                description="Save the whole room history privately; Spotify authorization stays in your browser."
                                className="col-span-2 border-r-0"
                            />
                        </ul>
                    </div>
                </section>
            </main>

            <footer className="bg-night border-t border-white/15 px-5 py-7 sm:px-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <BrandMark compact className="text-2xl" />
                        <a
                            href="https://www.timkolesnichenko.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-display mt-3 flex w-fit items-center gap-2 text-lg font-extrabold tracking-[-0.025em] text-white transition-colors hover:text-white/70"
                        >
                            Created by Tim Kolesnichenko
                            <ArrowUpRight className="size-4" />
                        </a>
                        <p className="mt-1 text-sm text-white/50">
                            Based on{" "}
                            <a
                                href="https://github.com/motz0815/songup"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-4 hover:text-white"
                            >
                                SongUp
                            </a>{" "}
                            by Matthias.
                        </p>
                    </div>
                    <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/70">
                        <Link href="/about" className="hover:text-white">
                            About
                        </Link>
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

function Capability({
    title,
    description,
    className = "",
}: {
    title: string
    description: string
    className?: string
}) {
    return (
        <li
            className={`border-ink/30 border-b-2 px-3 py-3 odd:border-r-2 sm:px-5 sm:py-4 ${className}`}
        >
            <h3 className="font-display text-base leading-tight font-extrabold tracking-[-0.03em] sm:text-xl">
                {title}
            </h3>
            <p className="text-ink/65 mt-1 text-xs leading-snug sm:text-sm sm:leading-relaxed">
                {description}
            </p>
        </li>
    )
}
