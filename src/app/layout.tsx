import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
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

const siteUrl = "https://democratune.timkolesnichenko.me"
const siteTitle = "DemocraTune — Free shared music queue for parties"
const siteDescription =
    "Create a free shared music queue for parties. Guests scan a QR code to request songs, vote together, and take fair turns — no accounts or app downloads."

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: "DemocraTune",
    title: { default: siteTitle, template: "%s | DemocraTune" },
    description: siteDescription,
    keywords: [
        "collaborative music queue",
        "party music queue",
        "shared playlist",
        "group music voting",
        "fair song queue",
        "open source music app",
        "DemocraTune",
    ],
    authors: [
        {
            name: "Tim Kolesnichenko",
            url: "https://www.timkolesnichenko.me/",
        },
    ],
    creator: "Tim Kolesnichenko",
    publisher: "Tim Kolesnichenko",
    category: "music",
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        locale: "en_GB",
        url: "/",
        siteName: "DemocraTune",
        title: siteTitle,
        description: siteDescription,
    },
    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: siteDescription,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
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
