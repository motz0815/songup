/**
 * Returns the site's base URL as a valid absolute URL.
 *
 * NEXT_PUBLIC_SITE_URL may be configured as a bare domain (e.g. "songup.tv")
 * in some environments. `new URL()` / metadataBase throw on a scheme-less
 * value, so normalize it here by adding https:// when missing. Mirrors the
 * getURL() helper in @songup/ui (the blog is a standalone Nextra app and does
 * not depend on that package).
 */
export function getSiteUrl(): string {
    const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    let url = configured && configured !== "" ? configured : "https://songup.tv"
    url = url.replace(/\/+$/, "")
    if (!url.includes("http")) {
        url = `https://${url}`
    }
    return url
}
