import { fingerprint } from "@/convex/fingerprint"
import { describe, expect, it } from "vitest"

describe("fingerprint", () => {
    it("normalises case, accents, whitespace and punctuation", () => {
        expect(fingerprint("Beyoncé", "Crazy In Love")).toBe(
            fingerprint("BEYONCE", "crazy-in-love"),
        )
        expect(fingerprint("AC/DC", "T.N.T.")).toBe(
            fingerprint("ACDC", "TNT"),
        )
    })

    it.each([
        "Song (Official Video)",
        "Song [Official Audio]",
        "Song (Lyrics)",
        "Song [4K]",
        "Song (Visualizer)",
    ])("ignores upload decoration in %s", (decoratedTitle) => {
        expect(fingerprint("Artist", decoratedTitle)).toBe(
            fingerprint("Artist", "Song"),
        )
    })

    it("ignores featured-artist spelling differences", () => {
        expect(fingerprint("Artist feat. Guest", "Song")).toBe(
            fingerprint("Artist", "Song"),
        )
        expect(fingerprint("Artist", "Song (featuring Guest)")).toBe(
            fingerprint("Artist", "Song"),
        )
    })

    it("keeps genuinely different recordings distinct", () => {
        expect(fingerprint("Artist", "Song (Live)")).not.toBe(
            fingerprint("Artist", "Song"),
        )
        expect(fingerprint("Artist", "Song (Acoustic)")).not.toBe(
            fingerprint("Artist", "Song"),
        )
    })
})
