import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto("/")
})

test("presents the brand, purpose and primary room actions", async ({
    page,
}) => {
    await expect(page).toHaveTitle(/DemocraTune/)
    await expect(
        page.getByRole("heading", { level: 1, name: "DemocraTune" }),
    ).toBeVisible()
    await expect(
        page.getByRole("heading", {
            level: 2,
            name: "Never fight over the aux again.",
        }),
    ).toBeVisible()

    const roomCode = page.getByLabel("Enter a four-character room code")
    await expect(roomCode).toBeVisible()
    await expect(
        page.getByRole("button", { name: /join the room/i }),
    ).toBeVisible()
    await expect(
        page.getByRole("link", { name: /host your own room/i }),
    ).toHaveAttribute("href", "/host")

    const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(hasHorizontalOverflow).toBe(false)
})

test("keeps an invalid room code on the landing page", async ({ page }) => {
    const roomCode = page.getByLabel("Enter a four-character room code")
    await roomCode.fill("ABC")
    await page.getByRole("button", { name: /join the room/i }).click()

    await expect(page).toHaveURL(/\/$/)
    expect(
        await roomCode.evaluate(
            (input: HTMLInputElement) => input.validity.valid,
        ),
    ).toBe(false)
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
