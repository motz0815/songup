import { cn, formatDuration, getURL } from "@/lib/utils"
import { afterEach, describe, expect, it, vi } from "vitest"

describe("formatDuration", () => {
    it.each([
        [0, "0:00"],
        [5, "0:05"],
        [65, "1:05"],
        [3599, "59:59"],
        [3600, "1:00:00"],
        [3661, "1:01:01"],
        [65.9, "1:05"],
    ])("formats %s seconds as %s", (seconds, expected) => {
        expect(formatDuration(seconds)).toBe(expected)
    })

    it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])(
        "falls back safely for %s",
        (seconds) => {
            expect(formatDuration(seconds)).toBe("0:00")
        },
    )
})

describe("getURL", () => {
    afterEach(() => {
        vi.unstubAllEnvs()
    })

    it("defaults to localhost and normalises the path", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "")
        vi.stubEnv("NEXT_PUBLIC_VERCEL_URL", "")

        expect(getURL("/privacy")).toBe("http://localhost:3000/privacy")
    })

    it("prefers the explicitly configured public site URL", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://democratune.example///")
        vi.stubEnv("NEXT_PUBLIC_VERCEL_URL", "preview.vercel.app")

        expect(getURL("terms")).toBe("https://democratune.example/terms")
    })

    it("uses the Vercel URL and adds HTTPS when no protocol is present", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "")
        vi.stubEnv("NEXT_PUBLIC_VERCEL_URL", "preview.vercel.app")

        expect(getURL()).toBe("https://preview.vercel.app")
    })
})

describe("cn", () => {
    it("merges conditional classes and resolves Tailwind conflicts", () => {
        expect(cn("px-2 text-sm", false && "hidden", "px-4")).toBe(
            "text-sm px-4",
        )
    })
})
