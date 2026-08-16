import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto("/about")
})

test("explains the problem, solution and fair queue", async ({ page }) => {
    await expect(page).toHaveTitle(
        "About DemocraTune — A fair shared music queue",
    )
    await expect(
        page.getByRole("heading", {
            level: 1,
            name: "One queue shouldn't mean one person controls it.",
        }),
    ).toBeVisible()
    await expect(
        page.getByRole("heading", {
            level: 2,
            name: "The party playlist has a people problem.",
        }),
    ).toBeVisible()
    await expect(
        page.getByRole("heading", {
            level: 2,
            name: "The solution is one room, open to everyone.",
        }),
    ).toBeVisible()
    await expect(
        page.getByRole("heading", { level: 3, name: "DemocraSchedule" }),
    ).toBeVisible()

    const hostLink = page
        .getByRole("link", { name: /host your own room/i })
        .first()
    await expect(hostLink).toHaveAttribute("href", "/host")
    await expect(
        page.getByRole("link", { name: "Tim Kolesnichenko" }),
    ).toHaveAttribute("href", "https://www.timkolesnichenko.me/")

    const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(hasHorizontalOverflow).toBe(false)
})
