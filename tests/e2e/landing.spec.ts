import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto("/")
})

test("presents the brand, purpose and primary room actions", async ({
    page,
}) => {
    await expect(page).toHaveTitle(
        "DemocraTune — Free shared music queue for parties",
    )
    await expect(
        page.getByRole("heading", { level: 1, name: "DemocraTune" }),
    ).toBeVisible()
    await expect(
        page.getByRole("heading", {
            level: 2,
            name: "The shared party queue where everyone gets a turn.",
        }),
    ).toBeVisible()

    const roomCode = page.getByLabel("Enter a four-character room code")
    await expect(roomCode).toBeVisible()
    await expect(
        page.getByRole("button", { name: /join the room/i }),
    ).toBeVisible()
    await expect(
        page.getByRole("link", { name: /host your own room/i }).first(),
    ).toHaveAttribute("href", "/host")

    await expect(
        page.getByRole("heading", {
            level: 2,
            name: "Everything the room can do.",
        }),
    ).toBeVisible()
    await expect(
        page.getByRole("heading", {
            level: 3,
            name: "Three fair schedulers",
        }),
    ).toBeVisible()
    await expect(
        page.getByText(
            "Join from any phone and request songs. No account, invite list, or download.",
            { exact: true },
        ),
    ).toBeVisible()
    await expect(
        page.getByRole("heading", {
            level: 3,
            name: "Spotify playlist export",
        }),
    ).toBeVisible()
    await expect(
        page.getByRole("link", { name: "Created by Tim Kolesnichenko" }),
    ).toHaveAttribute("href", "https://www.timkolesnichenko.me/")

    const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(hasHorizontalOverflow).toBe(false)
})

test("keeps an invalid room code on the landing page", async ({ page }) => {
    const roomCode = page.getByLabel("Enter a four-character room code")
    await roomCode.fill("ABC")

    const isValid = await roomCode.evaluate((input: HTMLInputElement) => {
        input.form?.requestSubmit()
        return input.validity.valid
    })

    expect(isValid).toBe(false)
    await expect(page).toHaveURL(/\/$/)
})

test("normalises a valid room code and requests that room", async ({
    page,
}) => {
    let requestedRoom = false
    await page.route(/\/room\/AB7K(?:\?.*)?$/, async (route) => {
        requestedRoom = true
        await route.abort()
    })

    await page.getByLabel("Enter a four-character room code").fill("ab7k")
    await page.getByRole("button", { name: /join the room/i }).click()

    await expect.poll(() => requestedRoom).toBe(true)
})
