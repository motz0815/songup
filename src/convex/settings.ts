/**
 * Room settings shared between the schedulers, the voting endpoints and room
 * creation. Kept in its own module so none of them have to import each other
 * just to agree on a default.
 */

/** A listener counts as present if they've checked in within this window. */
export const PRESENCE_WINDOW_MS = 2 * 60 * 1000

/** How often the room page checks in. Comfortably inside the window above. */
export const HEARTBEAT_INTERVAL_MS = 30 * 1000

/**
 * Share of listeners who have to downvote before a song is cut short. Used for
 * rooms created before the threshold was configurable.
 */
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
 * Scheduling weight given to a user with a neutral voting record. Higher values
 * make DemocraSchedule more forgiving: one downvote shouldn't halve someone's
 * share of the queue.
 */
export const BASE_WEIGHT = 4
export const MIN_WEIGHT = 1
export const MAX_WEIGHT = 12

/**
 * Turns a net vote score into a scheduling weight.
 *
 * The result is always strictly positive. That matters: a zero or negative
 * weight would let a user be selected while contributing nothing to the total,
 * which is how the previous weighted scheduler could spin forever.
 */
export function weightFromScore(score: number): number {
    return Math.min(MAX_WEIGHT, Math.max(MIN_WEIGHT, BASE_WEIGHT + score))
}

/**
 * How many downvotes the current song has to collect before it's cut short.
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
