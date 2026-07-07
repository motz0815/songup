import type { Metadata } from "next"
import { Footer, Layout, Navbar, ThemeSwitch } from "nextra-theme-blog"
import { Head, Search } from "nextra/components"
import { getPageMap } from "nextra/page-map"
import "nextra-theme-blog/style.css"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://songup.tv"

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
            <Head backgroundColor={{ dark: "#0f172a", light: "#fefce8" }} />
            <body>
                <Layout>
                    <Navbar pageMap={await getPageMap()}>
                        <Search />
                        <ThemeSwitch />
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
