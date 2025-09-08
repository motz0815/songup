import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: { default: "SongUp", template: "%s | SongUp" },
    description:
        "SongUp makes collaborative party music queueing easy. Open source, no login required. Get started - free.",
    keywords: ["songup", "party", "music", "queue", "open source"],
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>{children}</Providers>
                <Toaster richColors theme="light" />
            </body>
        </html>
    )
}
