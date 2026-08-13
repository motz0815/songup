import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

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
        <div className="min-h-screen bg-gradient-to-br from-slate-500 to-indigo-950 text-white">
            <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
                <header className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="size-5" />
                        <span className="font-bold">DemocraTune</span>
                    </Link>
                </header>

                <h1 className="text-3xl font-bold tracking-tight text-shadow-md sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-2 text-sm text-white/70">
                    Last updated {updated}
                </p>

                <div className="mt-6 rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-lg">
                    <p className="text-sm leading-relaxed text-white/90">
                        {summary}
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-8 leading-relaxed text-white/90">
                    {children}
                </div>

                <footer className="mt-12 border-t border-white/20 pt-6 text-sm text-white/70">
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
            <h2 className="text-xl font-bold text-shadow-sm">{title}</h2>
            {children}
        </section>
    )
}

/** Bulleted list with the spacing the rest of the page uses. */
export function List({ items }: { items: ReactNode[] }) {
    return (
        <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-white/50">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    )
}
