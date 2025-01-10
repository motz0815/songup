import Providers from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata, Viewport } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: { default: "SongUp", template: "%s | SongUp" },
    description:
        "SongUp makes collaborative party music queueing easy. Open source, no login required, just create a room and let the party begin!",
    keywords: ["party", "music", "queue", "songup"],
}

export const viewport: Viewport = {
    initialScale: 1,
    width: "device-width",
    maximumScale: 1,
    viewportFit: "cover",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    GeistSans.variable,
                    GeistMono.variable,
                )}
            >
                <Providers>
                    {children}
                    <Suspense>
                        <Toaster />
                    </Suspense>
                </Providers>
            </body>
        </html>
    )
}
