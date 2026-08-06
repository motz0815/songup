/**
 * Room settings shared between the schedulers, the voting endpoints and room
 * creation. Kept in its own module so none of them have to import each other
 * just to agree on a default.
 */

/** A listener counts as present if they've checked in within this window. */
export const PRESENCE_WINDOW_MS = 2 * 60 * 1000

/** How often the room page checks in. Comfortably inside the window above. */
export const HEARTBEAT_INTERVAL_MS = 30 * 1000

/** Used for rooms created before the skip threshold was configurable. */
export const DEFAULT_SKIP_THRESHOLD = 0.5

export const MIN_SKIP_THRESHOLD = 0.1
export const MAX_SKIP_THRESHOLD = 1

/**
 * Keeps the skip threshold inside a range that can't lock skipping out. Below
 * about 10% a single vote would end every song; above 100% no achievable number
 * of votes would ever be enough.
 */
export function clampSkipThreshold(threshold: number | undefined): number {
    if (threshold === undefined || !Number.isFinite(threshold)) {
        return DEFAULT_SKIP_THRESHOLD
    }
    return Math.min(
        MAX_SKIP_THRESHOLD,
        Math.max(MIN_SKIP_THRESHOLD, threshold),
    )
}

/**
 * How many skip votes the current song needs.
 *
 * Always at least one, so a room with a single listener isn't stuck with a song
 * nobody wants, and never more than the number of people who could vote.
 */
export function votesRequired(
    activeListeners: number,
    threshold: number,
): number {
    if (activeListeners <= 0) return 1
    return Math.min(
        activeListeners,
        Math.max(1, Math.ceil(activeListeners * threshold)),
    )
}
