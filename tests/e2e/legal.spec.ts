import { expect, test } from "@playwright/test"

test("publishes the operator, privacy contact and governing law", async ({
    page,
}) => {
    await page.goto("/privacy")

    await expect(
        page.getByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeVisible()
    await expect(page.getByText(/operated by Tim Kolesnichenko/)).toBeVisible()
    await expect(
        page.getByRole("link", { name: "democratune@gmail.com" }),
    ).toHaveAttribute("href", "mailto:democratune@gmail.com")

    await page.getByRole("link", { name: "Terms of Service" }).click()

    await expect(page).toHaveURL(/\/terms$/)
    await expect(
        page.getByRole("heading", { level: 1, name: "Terms of Service" }),
    ).toBeVisible()
    await expect(
        page.getByText(
            "These terms are governed by the laws of England and Wales.",
        ),
    ).toBeVisible()
    await expect(
        page.getByRole("link", { name: "democratune@gmail.com" }),
    ).toHaveAttribute("href", "mailto:democratune@gmail.com")
})
