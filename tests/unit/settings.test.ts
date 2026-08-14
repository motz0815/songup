import {
    BASE_WEIGHT,
    DEFAULT_SKIP_THRESHOLD,
    MAX_SKIP_THRESHOLD,
    MAX_WEIGHT,
    MIN_SKIP_THRESHOLD,
    MIN_WEIGHT,
    clampSkipThreshold,
    votesRequired,
    weightFromScore,
} from "@/convex/settings"
import { describe, expect, it } from "vitest"

describe("clampSkipThreshold", () => {
    it("preserves values inside the supported range", () => {
        expect(clampSkipThreshold(0.6)).toBe(0.6)
    })

    it("clamps values at both limits", () => {
        expect(clampSkipThreshold(-10)).toBe(MIN_SKIP_THRESHOLD)
        expect(clampSkipThreshold(10)).toBe(MAX_SKIP_THRESHOLD)
    })

    it.each([undefined, Number.NaN, Number.POSITIVE_INFINITY])(
        "uses the default for %s",
        (threshold) => {
            expect(clampSkipThreshold(threshold)).toBe(
                DEFAULT_SKIP_THRESHOLD,
            )
        },
    )
})

describe("weightFromScore", () => {
    it("starts neutral listeners at the base weight", () => {
        expect(weightFromScore(0)).toBe(BASE_WEIGHT)
    })

    it("adjusts the weight while enforcing safe bounds", () => {
        expect(weightFromScore(3)).toBe(BASE_WEIGHT + 3)
        expect(weightFromScore(-100)).toBe(MIN_WEIGHT)
        expect(weightFromScore(100)).toBe(MAX_WEIGHT)
    })
})

describe("votesRequired", () => {
    it.each([
        [1, 0.5, 1],
        [2, 0.5, 1],
        [3, 0.5, 2],
        [10, 0.6, 6],
    ])(
        "requires %s active listeners at threshold %s to cast %s votes",
        (listeners, threshold, expected) => {
            expect(votesRequired(listeners, threshold)).toBe(expected)
        },
    )

    it("always returns at least one vote for an empty room", () => {
        expect(votesRequired(0, 0.5)).toBe(1)
    })

    it("never asks for more votes than there are listeners", () => {
        expect(votesRequired(4, 5)).toBe(4)
    })
})
