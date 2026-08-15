import { LegalPage, List, Section } from "@/components/legal/legal-page"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "What DemocraTune stores, for how long, and who else sees it.",
    alternates: { canonical: "/privacy" },
    openGraph: {
        title: "Privacy Policy | DemocraTune",
        description:
            "What DemocraTune stores, for how long, and who else sees it.",
        url: "/privacy",
    },
    twitter: {
        title: "Privacy Policy | DemocraTune",
        description:
            "What DemocraTune stores, for how long, and who else sees it.",
    },
}

export default function Privacy() {
    return (
        <LegalPage
            title="Privacy Policy"
            updated="13 August 2026"
            summary={
                <>
                    DemocraTune has no accounts, so there is no name, email or
                    password to lose. What it keeps is a nickname you pick, the
                    songs you queue and the votes you cast — and all of it is
                    deleted with the room, within 48 hours.
                </>
            }
        >
            <Section title="Who this covers">
                <p>
                    This policy covers the copy of DemocraTune running at{" "}
                    <span className="font-medium">
                        democratune.timkolesnichenko.me
                    </span>
                    . It is operated by Tim Kolesnichenko, who is the data
                    controller for this instance.
                </p>
                <p>
                    DemocraTune is open source, and anyone is free to run their
                    own copy. If you are using someone else&apos;s instance,
                    this policy does not apply to it — that operator decides
                    what their server does, and you should ask them.
                </p>
            </Section>

            <Section title="What is stored">
                <p>
                    When you join a room, the app creates an anonymous identity
                    for your browser. It is a random identifier and nothing
                    more: it is not linked to a name, an email address, a phone
                    number or a social account, because you never give us any.
                </p>
                <p>Attached to that identifier, while a room is alive:</p>
                <List
                    items={[
                        <>
                            <span className="font-medium">
                                The nickname you type.
                            </span>{" "}
                            You choose it, and other people in the room see it.
                            It does not have to be your real name.
                        </>,
                        <>
                            <span className="font-medium">
                                The songs you queue
                            </span>{" "}
                            — title, artist, length and the YouTube video — and
                            which room they went into.
                        </>,
                        <>
                            <span className="font-medium">
                                The votes you cast,
                            </span>{" "}
                            and the rating they add up to inside that room.
                        </>,
                        <>
                            <span className="font-medium">
                                A timestamp saying you are still here,
                            </span>{" "}
                            refreshed while the room page is open. This is what
                            makes the skip threshold a share of the people
                            actually present.
                        </>,
                        <>
                            <span className="font-medium">
                                The room&apos;s play history,
                            </span>{" "}
                            including how each song was voted on.
                        </>,
                    ]}
                />
                <p>
                    The app also keeps a catalogue of the songs themselves —
                    title, artist, length, and links to the same recording on
                    other streaming services. That catalogue is about music, not
                    about people, and it carries no connection to who played
                    what.
                </p>
            </Section>

            <Section title="What is not stored">
                <p>
                    No account, no password, no email address, no phone number.
                    No advertising or cross-site tracking cookies. Nothing is
                    sold, rented or shared for marketing, by anyone, ever.
                </p>
            </Section>

            <Section title="How long it is kept">
                <p>
                    Rooms expire 48 hours after they are created, and an
                    automated job clears out expired ones every hour. When a
                    room goes, everything attached to it goes with it: its
                    queue, its history, its votes and its presence records.
                </p>
                <p>
                    You do not have to wait for that. A room host can end a room
                    at any time, which deletes the same data immediately.
                </p>
            </Section>

            <Section title="Analytics">
                <p>
                    DemocraTune uses PostHog to count things like how many rooms
                    get created and which pages people open. It runs in
                    cookieless mode, which means it sets no cookies and builds
                    no persistent profile of you across visits. The data is
                    processed on PostHog&apos;s EU infrastructure.
                </p>
            </Section>

            <Section title="Other services involved">
                <p>
                    Running the app means handing some data to the companies
                    underneath it. Each has its own privacy policy:
                </p>
                <List
                    items={[
                        <>
                            <span className="font-medium">Vercel</span> hosts
                            the site and keeps ordinary server logs, which
                            include IP addresses and request details.
                        </>,
                        <>
                            <span className="font-medium">Convex</span> stores
                            the room data described above.
                        </>,
                        <>
                            <span className="font-medium">
                                YouTube and Google
                            </span>{" "}
                            provide the embedded player that actually plays the
                            music, and the search results behind the song
                            picker. Watching a video in the embed is a visit to
                            YouTube, and Google treats it as one.
                        </>,
                        <>
                            <span className="font-medium">song.link</span> is
                            asked which other services carry a given recording,
                            so the history can link out to them. It is told the
                            video, never anything about you.
                        </>,
                        <>
                            <span className="font-medium">PostHog</span>, as
                            described above.
                        </>,
                    ]}
                />
            </Section>

            <Section title="Connecting Spotify">
                <p>
                    Exporting a room&apos;s history to a Spotify playlist is
                    entirely optional, and it happens in your browser rather
                    than on our server.
                </p>
                <p>
                    Signing in sends you to Spotify, and Spotify sends back an
                    access token that stays in your browser tab. It is never
                    transmitted to DemocraTune, so there is nothing on our side
                    to leak or misuse. The token asks for permission to create
                    and add to playlists — nothing else — and it is discarded
                    when you close the tab. No long-lived refresh token is
                    stored, so the connection cannot outlive your visit and give
                    anyone standing access to your account.
                </p>
            </Section>

            <Section title="Children">
                <p>
                    DemocraTune is not aimed at children and does not knowingly
                    collect anything from them. Since it asks for no personal
                    details at all, there is very little to collect either way.
                </p>
            </Section>

            <Section title="Your choices">
                <p>
                    Leaving a room stops the presence timestamp. Not connecting
                    Spotify means no Spotify data is ever involved. Waiting 48
                    hours, or asking the host to end the room, removes the rest.
                </p>
                <p>
                    If you want something removed sooner, or want to know what
                    is held about a room you were in, get in touch and we will
                    sort it out. Because the app has no accounts, we may not be
                    able to work out which anonymous identifier was yours
                    without your help.
                </p>
                <p>
                    If you are unhappy with how your personal data is handled,
                    you can also complain to the UK Information
                    Commissioner&apos;s Office through its{" "}
                    <a
                        href="https://ico.org.uk/make-a-complaint/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        complaints service
                    </a>
                    .
                </p>
            </Section>

            <Section title="Changes">
                <p>
                    If this policy changes, the date at the top changes with it.
                    The full history of every version is in the project&apos;s{" "}
                    <a
                        href="https://github.com/KOLESNiii/DemocraTune/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        public git repository
                    </a>
                    , so you can see exactly what moved and when.
                </p>
            </Section>

            <Section title="Contact">
                <p>
                    Privacy questions and data-protection requests can go to{" "}
                    <a
                        href="mailto:democratune@gmail.com"
                        className="font-medium underline"
                    >
                        democratune@gmail.com
                    </a>
                    . General questions can also go to an issue on the GitHub
                    repository if you would rather ask in public.
                </p>
                <p>
                    See also the{" "}
                    <Link href="/terms" className="underline">
                        Terms of Service
                    </Link>
                    .
                </p>
            </Section>
        </LegalPage>
    )
}
