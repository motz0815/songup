import { LegalPage, List, Section } from "@/components/legal/legal-page"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Terms of Service - DemocraTune",
    description:
        "The terms for using DemocraTune, and the freedoms its licence gives you.",
}

export default function Terms() {
    return (
        <LegalPage
            title="Terms of Service"
            updated="13 August 2026"
            summary={
                <>
                    DemocraTune is free, open source and provided as-is. You can
                    use it, copy it, change it and run your own. In exchange
                    there are no promises: not that it works, not that it stays
                    up, and not that anyone is liable if it doesn&apos;t.
                </>
            }
        >
            <Section title="What this covers">
                <p>
                    These terms apply to the copy of DemocraTune running at{" "}
                    <span className="font-medium">
                        democratune.timkolesnichenko.me
                    </span>
                    , operated by Tim Kolesnichenko. Using it means accepting
                    them.
                </p>
                <p>
                    They cover the hosted service, not the software. The
                    software is governed by its licence, which gives you rights
                    these terms cannot take away — see below.
                </p>
            </Section>

            <Section title="It costs nothing, and it promises nothing">
                <p>
                    DemocraTune is free for everyone. There is no payment, no
                    subscription and no paid tier.
                </p>
                <p>
                    It is also provided{" "}
                    <span className="font-medium">as-is</span> and{" "}
                    <span className="font-medium">as-available</span>, with no
                    warranty of any kind. Rooms may break mid-party, songs may
                    fail to play, search may go down, and the whole service may
                    disappear without notice. To the fullest extent the law
                    allows, nobody involved in making or running DemocraTune is
                    liable for any loss arising from using it or being unable to
                    use it. This mirrors the disclaimer in the software&apos;s
                    licence, and is the deal in exchange for it being free.
                </p>
            </Section>

            <Section title="No accounts, and what that means for you">
                <p>
                    You do not sign up, so there is nothing to be locked out of.
                    The flip side is that your identity in a room lives in your
                    browser: clearing site data or switching device means
                    starting fresh, and your queue, votes and rating do not
                    follow you.
                </p>
                <p>
                    Anyone with a room code can join that room. Treat the code
                    as the only thing standing between your party and a
                    stranger&apos;s song choices, and share it accordingly.
                </p>
            </Section>

            <Section title="Behave in rooms">
                <p>
                    Queueing a song puts it in front of everyone present, often
                    on a television. Don&apos;t use that to harass people or to
                    play content that is illegal where you are. Room hosts can
                    skip anything and end the room outright, and that decision
                    is theirs to make.
                </p>
                <p>Beyond that, please don&apos;t:</p>
                <List
                    items={[
                        "hammer the service with automated requests, or try to work around the per-user song limits",
                        "attempt to break into the service, its data, or other people's rooms",
                        "use it to distribute or download music outside the streaming services it links to",
                    ]}
                />
                <p>
                    Access may be blocked if any of this happens. Given there
                    are no accounts, that is a blunt instrument, so it is used
                    sparingly.
                </p>
            </Section>

            <Section title="The music is not ours">
                <p>
                    DemocraTune hosts no audio. Songs play through
                    YouTube&apos;s embedded player, and searching uses YouTube
                    Music. Your use of that playback is subject to{" "}
                    <a
                        href="https://www.youtube.com/t/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        YouTube&apos;s Terms of Service
                    </a>
                    .
                </p>
                <p>
                    Links out to Spotify, Amazon Music, Tidal, Deezer and others
                    are just links. If you export a room&apos;s history to a
                    Spotify playlist, that is between you and Spotify under
                    their terms, and DemocraTune is only the thing that asked.
                </p>
            </Section>

            <Section title="The software is yours to take">
                <p>
                    DemocraTune is licensed under the{" "}
                    <a
                        href="https://www.gnu.org/licenses/agpl-3.0.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        GNU Affero General Public License, version 3
                    </a>
                    . That licence, not this page, governs the code, and it
                    gives you the right to:
                </p>
                <List
                    items={[
                        "run it for any purpose, including commercially",
                        "read the source, and change it however you like",
                        "share it, modified or not, under the same licence",
                        "host your own instance instead of using this one",
                    ]}
                />
                <p>
                    Because the AGPL covers use over a network, anyone
                    interacting with this instance is entitled to its complete
                    source code. It lives at{" "}
                    <a
                        href="https://github.com/KOLESNiii/DemocraTune/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        github.com/KOLESNiii/DemocraTune
                    </a>
                    , which satisfies that offer. If you run a modified copy for
                    other people, you owe them your modified source in turn.
                </p>
                <p>
                    DemocraTune is a fork of{" "}
                    <a
                        href="https://github.com/motz0815/songup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        SongUp
                    </a>{" "}
                    by Matthias, used and extended under the same licence.
                </p>
                <p>
                    Nothing on this page restricts what the AGPL permits. Where
                    the two disagree about the software, the licence wins.
                </p>
            </Section>

            <Section title="What you queue">
                <p>
                    You keep whatever rights you have in what you contribute —
                    which, for a nickname and a list of song choices, is not
                    much. You grant permission to display it to the room and to
                    store it for as long as the room lasts, which is what makes
                    the app work at all.
                </p>
            </Section>

            <Section title="Rooms end">
                <p>
                    Rooms expire 48 hours after creation and are then deleted,
                    along with their queue and history. Hosts can end a room
                    sooner. Export anything you want to keep before then — the
                    history page is there for exactly that.
                </p>
            </Section>

            <Section title="Changes">
                <p>
                    These terms may change; the date at the top will say when.
                    Every revision is visible in the project&apos;s public git
                    history, so nothing changes quietly.
                </p>
            </Section>

            <Section title="Governing law and contact">
                <p>
                    These terms are governed by the laws of England and Wales.
                </p>
                <p>
                    Questions go to{" "}
                    <a
                        href="mailto:democratune@gmail.com"
                        className="font-medium underline"
                    >
                        democratune@gmail.com
                    </a>{" "}
                    or to an issue on GitHub. See also the{" "}
                    <Link href="/privacy" className="underline">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </Section>
        </LegalPage>
    )
}
