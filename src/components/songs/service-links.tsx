"use client"

import { cn } from "@/lib/utils"

/** Matches the key `convex/tracks.ts` stores the song.link page under. */
const ODESLI_PAGE_KEY = "odesli"

/**
 * Services worth naming, in the order they get shown.
 *
 * Odesli reports about a dozen, which is more chips than anyone reads. These
 * are the ones a guest at a party plausibly has open on their phone; the rest
 * are reachable through the song.link page at the end of the row.
 */
const NAMED_SERVICES: Array<[key: string, label: string]> = [
    ["spotify", "Spotify"],
    ["appleMusic", "Apple Music"],
    ["amazonMusic", "Amazon Music"],
    ["tidal", "Tidal"],
    ["deezer", "Deezer"],
    ["youtubeMusic", "YouTube Music"],
]

const MAX_CHIPS = 3

/**
 * Where else this song can be heard.
 *
 * Renders nothing at all when a song didn't resolve, which is common enough to
 * be unremarkable - a row of "not found" chips would be noise, and the song is
 * still listed with its name and artist either way.
 */
export function ServiceLinks({
    links,
    className,
}: {
    links?: Record<string, string>
    className?: string
}) {
    if (!links) return null

    const named = NAMED_SERVICES.filter(([key]) => links[key]).slice(0, MAX_CHIPS)
    const page = links[ODESLI_PAGE_KEY]

    if (named.length === 0) return null

    return (
        <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
            {named.map(([key, label]) => (
                <Chip key={key} href={links[key]} label={label} />
            ))}
            {page && <Chip href={page} label="More…" muted />}
        </div>
    )
}

function Chip({
    href,
    label,
    muted,
}: {
    href: string
    label: string
    muted?: boolean
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "rounded-full border px-2 py-0.5 text-xs whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none",
                "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
                muted
                    ? "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
                    : "border-white/25 text-white/80 hover:border-white/50 hover:bg-white/10 hover:text-white",
            )}
        >
            {label}
        </a>
    )
}
