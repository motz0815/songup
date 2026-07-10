import type { Metadata } from "next"
import { Footer, Layout, Navbar } from "nextra-theme-blog"
import { Head, Search } from "nextra/components"
import { getPageMap } from "nextra/page-map"
import "nextra-theme-blog/style.css"
import "./blog.css"
import { getSiteUrl } from "@/lib/site-url"

const SITE_URL = getSiteUrl()

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "SongUp Blog",
        template: "%s | SongUp Blog",
    },
    description:
        "Product updates, guides, and stories about SongUp — the collaborative song request queue for parties, bars, and events.",
    openGraph: {
        siteName: "SongUp Blog",
        type: "website",
        url: `${SITE_URL}/blog`,
    },
    twitter: {
        card: "summary_large_image",
    },
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <Head backgroundColor={{ dark: "#000000", light: "#000000" }} />
            <body className="songup-blog">
                <Layout nextThemes={{ forcedTheme: "dark" }}>
                    <Navbar pageMap={await getPageMap()}>
                        {/* The Website zone owns this route. */}
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/" className="home-link">
                            <span aria-hidden="true">←</span>
                            SongUp home
                        </a>
                        <Search />
                    </Navbar>

                    {children}

                    <Footer>
                        {new Date().getFullYear()} © SongUp.
                        <a href="/blog/rss.xml" style={{ float: "right" }}>
                            RSS
                        </a>
                    </Footer>
                </Layout>
            </body>
        </html>
    )
}
