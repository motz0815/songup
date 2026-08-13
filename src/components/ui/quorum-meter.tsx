"use client"

import { cn } from "@/lib/utils"

/** Above this many votes a row of pips stops being readable at a glance. */
const MAX_PIPS = 12

/**
 * Shows how close the room is to skipping the song that's playing.
 *
 * Deliberately discrete rather than a progress bar: the threshold is a whole
 * number of people, and a filled bar would imply that half a vote exists. Each
 * pip is one person who pressed the button.
 */
export function QuorumMeter({
    votes,
    required,
    size = "default",
    tone = "dark",
    className,
}: {
    votes: number
    required: number
    size?: "default" | "compact"
    tone?: "dark" | "light"
    className?: string
}) {
    const met = required > 0 && votes >= required
    const compact = size === "compact"

    return (
        <div
            className={cn("flex items-center gap-3", className)}
            role="meter"
            aria-valuenow={votes}
            aria-valuemin={0}
            aria-valuemax={required}
            aria-label={`${votes} of ${required} votes to skip`}
        >
            {required <= MAX_PIPS ? (
                <div className={cn("flex", compact ? "gap-1" : "gap-1.5")}>
                    {Array.from({ length: required }, (_, index) => (
                        <span
                            key={index}
                            className={cn(
                                "rounded-full border transition-colors duration-300 motion-reduce:transition-none",
                                compact ? "size-2" : "size-2.5",
                                index < votes
                                    ? "border-quorum bg-quorum"
                                    : tone === "dark"
                                      ? "border-white/30 bg-white/5"
                                      : "border-ink/35 bg-transparent",
                            )}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className={cn(
                        "overflow-hidden rounded-full",
                        tone === "dark" ? "bg-white/10" : "bg-ink/10",
                        compact ? "h-1.5 w-20" : "h-2 w-32",
                    )}
                >
                    <div
                        className="bg-quorum h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
                        style={{
                            width: `${Math.min(100, (votes / required) * 100)}%`,
                        }}
                    />
                </div>
            )}

            <p
                className={cn(
                    "tabular-nums",
                    compact ? "text-xs" : "text-sm",
                    met
                        ? "text-quorum font-semibold"
                        : tone === "dark"
                          ? "text-white/70"
                          : "text-ink/65",
                )}
            >
                {met ? "Skipping" : `${votes} of ${required} to skip`}
            </p>
        </div>
    )
}
