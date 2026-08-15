import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { BrandMark } from "../brand/brand-mark"

/**
 * The shell both legal pages sit in.
 *
 * Long-form reading, so this deliberately drops the glass panels used
 * everywhere else - a wall of text behind a blur is hard to read. It keeps the
 * app's gradient and header so the pages still feel like part of DemocraTune
 * rather than somewhere you got redirected to.
 */
export function LegalPage({
    title,
    updated,
    summary,
    children,
}: {
    title: string
    updated: string
    summary: ReactNode
    children: ReactNode
}) {
    return (
        <div className="paper-field text-ink min-h-screen">
            <div className="mx-auto max-w-3xl px-5 py-7 sm:px-8 md:py-12">
                <header className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 transition-opacity hover:opacity-65"
                    >
                        <ArrowLeft className="size-5" />
                        <BrandMark compact className="text-2xl" />
                    </Link>
                </header>

                <h1 className="font-display border-ink border-t-2 pt-8 text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] sm:text-7xl">
                    {title}
                </h1>
                <p className="font-code text-ink/50 mt-3 text-xs tracking-[0.14em] uppercase">
                    Last updated {updated}
                </p>

                <div className="border-ink mt-8 border-y-2 py-5">
                    <p className="text-ink/75 text-lg leading-relaxed">
                        {summary}
                    </p>
                </div>

                <div className="text-ink/80 mt-10 flex flex-col gap-10 leading-relaxed">
                    {children}
                </div>

                <footer className="border-ink text-ink/60 mt-14 border-t-2 pt-6 text-sm">
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <Link href="/privacy" className="underline">
                            Privacy
                        </Link>
                        <Link href="/terms" className="underline">
                            Terms
                        </Link>
                        <a
                            href="https://github.com/KOLESNiii/DemocraTune/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Source code
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    )
}

/** A titled section. Keeps heading rhythm identical across both documents. */
export function Section({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    return (
        <section className="flex flex-col gap-3">
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.035em]">
                {title}
            </h2>
            {children}
        </section>
    )
}

/** Bulleted list with the spacing the rest of the page uses. */
export function List({ items }: { items: ReactNode[] }) {
    return (
        <ul className="marker:text-signal flex list-disc flex-col gap-2 pl-5">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    )
}
