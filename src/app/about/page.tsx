import { BrandMark } from "@/components/brand/brand-mark"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: {
        absolute: "About DemocraTune — A fair shared music queue",
    },
    description:
        "Why DemocraTune replaces one-person party playlists with a free shared music queue where guests request songs, vote, and take fair turns.",
    alternates: { canonical: "/about" },
    openGraph: {
        title: "About DemocraTune — A fair shared music queue",
        description:
            "From one person controlling the playlist to a shared party queue where every guest gets a fair turn.",
        url: "/about",
    },
    twitter: {
        title: "About DemocraTune — A fair shared music queue",
        description:
            "From one person controlling the playlist to a shared party queue where every guest gets a fair turn.",
    },
}

const problems = [
    {
        number: "01",
        title: "One phone becomes the bottleneck",
        description:
            "Every request has to pass through the person holding the aux, interrupting the party and leaving most guests out.",
    },
    {
        number: "02",
        title: "The loudest guest fills the queue",
        description:
            "A normal playlist rewards whoever adds fastest, not a room trying to share the music fairly.",
    },
    {
        number: "03",
        title: "Bad picks are hard to resolve",
        description:
            "Without a shared vote, skipping a song becomes an argument—or one person quietly making every decision.",
    },
]

const steps = [
    ["Create", "The host starts a free room and puts it on a TV or laptop."],
    ["Join", "Guests scan the QR code. There are no accounts or downloads."],
    [
        "Choose",
        "Everyone searches for songs, requests tracks, and votes together.",
    ],
    [
        "Take turns",
        "The selected scheduler turns those requests into a fair live queue.",
    ],
]

const schedulers = [
    [
        "First come, first served",
        "Keep the familiar queue when order is all that matters.",
    ],
    [
        "Round robin",
        "Play one request from each guest before returning to anyone.",
    ],
    [
        "DemocraSchedule",
        "Use room votes to weight future turns while keeping everyone interleaved.",
    ],
]

export default function AboutPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About DemocraTune",
        url: "https://democratune.timkolesnichenko.me/about",
        description:
            "How DemocraTune makes shared party music queues easy and fair.",
        mainEntity: {
            "@type": "WebApplication",
            name: "DemocraTune",
            url: "https://democratune.timkolesnichenko.me/",
            applicationCategory: "MultimediaApplication",
            isAccessibleForFree: true,
        },
    }

    return (
        <div className="paper-field text-ink min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(
                        /</g,
                        "\\u003c",
                    ),
                }}
            />

            <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-10 sm:py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-3 transition-opacity hover:opacity-65"
                    aria-label="Back to DemocraTune"
                >
                    <ArrowLeft className="size-5" />
                    <BrandMark compact className="text-2xl sm:text-3xl" />
                </Link>
                <Link
                    href="/host"
                    className="bg-signal border-ink inline-flex items-center gap-2 border-2 px-4 py-3 font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                    Host a room
                    <ArrowUpRight className="size-4" />
                </Link>
            </header>

            <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-10 sm:pb-24">
                <section className="bg-night relative isolate overflow-hidden border-2 border-black px-5 py-10 text-white shadow-[7px_7px_0_0_#ff593d] sm:px-9 sm:py-14 lg:px-14 lg:py-16">
                    <div className="halftone-field pointer-events-none absolute inset-0 -z-10 text-white/10" />
                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                        <div>
                            <h1 className="font-display max-w-4xl text-5xl leading-[0.88] font-extrabold tracking-[-0.065em] text-balance sm:text-7xl">
                                One queue shouldn&apos;t mean one person
                                controls it.
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
                                DemocraTune is a free shared music queue for
                                parties. It gives every guest a simple way to
                                request songs—and the whole room a fair way to
                                decide what plays.
                            </p>
                        </div>
                        <p className="border-signal border-l-4 pl-5 text-xl leading-snug font-semibold sm:text-2xl">
                            Less passing around the aux. More discovering music
                            together.
                        </p>
                    </div>
                </section>

                <section className="border-ink mt-16 border-t-2 pt-8 sm:mt-20">
                    <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
                        <h2 className="font-display text-5xl leading-[0.9] font-extrabold tracking-[-0.055em] sm:text-6xl">
                            The party playlist has a people problem.
                        </h2>
                        <p className="text-ink/65 max-w-2xl text-lg lg:justify-self-end">
                            Shared music usually means a single device, a long
                            queue, and no agreed way to balance everyone&apos;s
                            taste. The technology works; the social arrangement
                            does not.
                        </p>
                    </div>

                    <ol className="border-ink mt-8 grid border-t-2 sm:grid-cols-3">
                        {problems.map((problem) => (
                            <li
                                key={problem.number}
                                className="border-ink/30 border-b-2 p-5 sm:border-r-2 sm:p-6 sm:last:border-r-0"
                            >
                                <span className="font-code text-signal text-sm font-bold">
                                    {problem.number}
                                </span>
                                <h3 className="font-display mt-4 text-2xl leading-tight font-extrabold tracking-[-0.04em]">
                                    {problem.title}
                                </h3>
                                <p className="text-ink/65 mt-3 leading-relaxed">
                                    {problem.description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="bg-broadcast border-ink mt-16 border-2 px-5 py-9 text-white shadow-[7px_7px_0_0_#111512] sm:mt-20 sm:px-8 sm:py-12">
                    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
                        <h2 className="font-display text-5xl leading-[0.9] font-extrabold tracking-[-0.055em] sm:text-6xl">
                            The solution is one room, open to everyone.
                        </h2>
                        <div className="max-w-2xl text-lg leading-relaxed text-white/85 lg:justify-self-end">
                            <p>
                                DemocraTune separates the shared controls from
                                the big-screen player. The host keeps playback
                                running while every guest uses their own phone
                                to contribute.
                            </p>
                            <p className="mt-4">
                                Nothing to install. Nothing to sign up for.
                                Scan, pick a nickname, and join the live queue.
                            </p>
                        </div>
                    </div>

                    <ol className="mt-10 grid gap-px bg-white/35 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map(([title, description], index) => (
                            <li key={title} className="bg-broadcast p-5 sm:p-6">
                                <span className="font-code text-sm font-bold text-white/65">
                                    0{index + 1}
                                </span>
                                <h3 className="font-display mt-3 text-2xl font-extrabold">
                                    {title}
                                </h3>
                                <p className="mt-2 leading-relaxed text-white/75">
                                    {description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="mt-16 grid gap-8 sm:mt-20 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <h2 className="font-display text-5xl leading-[0.9] font-extrabold tracking-[-0.055em] sm:text-6xl">
                            Fair can mean more than first.
                        </h2>
                        <p className="text-ink/65 mt-5 max-w-xl text-lg leading-relaxed">
                            Different rooms need different rules, so the host
                            can choose how requests become the next song.
                        </p>
                    </div>
                    <div className="border-ink border-t-2">
                        {schedulers.map(([title, description]) => (
                            <div
                                key={title}
                                className="border-ink/30 grid gap-2 border-b-2 py-5 sm:grid-cols-[0.8fr_1.2fr] sm:gap-5"
                            >
                                <h3 className="font-display text-xl font-extrabold">
                                    {title}
                                </h3>
                                <p className="text-ink/65">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="border-ink mt-16 grid gap-8 border-y-2 py-9 sm:mt-20 sm:grid-cols-2 sm:py-12">
                    <div>
                        <h2 className="font-display text-3xl font-extrabold tracking-[-0.045em]">
                            Private by default
                        </h2>
                        <p className="text-ink/65 mt-3 max-w-xl leading-relaxed">
                            There are no user accounts. Room data is temporary,
                            and Spotify authorization for playlist export stays
                            in your browser.
                        </p>
                        <Link
                            href="/privacy"
                            className="mt-5 inline-flex items-center gap-2 font-bold hover:opacity-65"
                        >
                            Read the privacy policy
                            <ArrowUpRight className="size-4" />
                        </Link>
                    </div>
                    <div>
                        <h2 className="font-display text-3xl font-extrabold tracking-[-0.045em]">
                            Open source on purpose
                        </h2>
                        <p className="text-ink/65 mt-3 max-w-xl leading-relaxed">
                            The code is public under the AGPL. Inspect it,
                            improve it, or host your own instance. DemocraTune
                            builds on the original SongUp project by Matthias.
                        </p>
                        <a
                            href="https://github.com/KOLESNiii/DemocraTune/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center gap-2 font-bold hover:opacity-65"
                        >
                            Explore the source code
                            <ArrowUpRight className="size-4" />
                        </a>
                    </div>
                </section>

                <section className="mt-16 text-center sm:mt-20">
                    <h2 className="font-display mx-auto max-w-4xl text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] text-balance sm:text-7xl">
                        Your party already has the music. Give everyone a turn.
                    </h2>
                    <Link
                        href="/host"
                        className="bg-signal border-ink mt-8 inline-flex min-h-20 w-full items-center justify-between border-2 px-6 text-left text-white shadow-[7px_7px_0_0_#111512] transition-transform hover:-translate-y-1 sm:w-auto sm:min-w-xl sm:px-8"
                    >
                        <span className="font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
                            Host your own room
                        </span>
                        <ArrowUpRight className="size-8 shrink-0" />
                    </Link>
                    <p className="text-ink/60 mt-6">
                        Created by{" "}
                        <a
                            href="https://www.timkolesnichenko.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline underline-offset-4"
                        >
                            Tim Kolesnichenko
                        </a>
                        .
                    </p>
                </section>
            </main>

            <footer className="bg-night px-5 py-7 text-white sm:px-10">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
                    <BrandMark compact className="text-2xl" />
                    <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/70">
                        <Link href="/" className="hover:text-white">
                            Home
                        </Link>
                        <Link href="/privacy" className="hover:text-white">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-white">
                            Terms
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}
