import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import { getURL } from "@/lib/utils"
import type { Metadata } from "next"
import {
    Bricolage_Grotesque,
    IBM_Plex_Mono,
    IBM_Plex_Sans,
} from "next/font/google"
import "./globals.css"

const bricolage = Bricolage_Grotesque({
    variable: "--font-bricolage",
    subsets: ["latin"],
})

const plexSans = IBM_Plex_Sans({
    variable: "--font-plex-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

const plexMono = IBM_Plex_Mono({
    variable: "--font-plex-mono",
    subsets: ["latin"],
    weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
    metadataBase: new URL(getURL()),
    title: { default: "DemocraTune", template: "%s | DemocraTune" },
    description:
        "DemocraTune makes collaborative party music queueing easy. Open source, no login required. Get started - free.",
    keywords: ["democratune", "party", "music", "queue", "open source"],
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable}`}
        >
            <body className="antialiased">
                <Providers>{children}</Providers>
                <Toaster richColors theme="light" />
            </body>
        </html>
    )
}
