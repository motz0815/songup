import { Metadata } from "next"
import { Footer, Layout, Navbar } from "nextra-theme-docs"
import "nextra-theme-docs/style.css"
import { Head } from "nextra/components"
import { getPageMap } from "nextra/page-map"

export const metadata: Metadata = {
    title: {
        default: "SongUp Docs",
        template: "%s | SongUp Docs",
    },
}

const navbar = <Navbar logo={<b>SongUp</b>} />
const footer = <Footer>AGPL-3.0 {new Date().getFullYear()} © SongUp.</Footer>

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" dir="ltr" suppressHydrationWarning>
            <Head />
            <body>
                <Layout
                    navbar={navbar}
                    pageMap={await getPageMap()}
                    docsRepositoryBase="https://github.com/motz0815/songup-docs"
                    footer={footer}
                >
                    {children}
                </Layout>
            </body>
        </html>
    )
}
