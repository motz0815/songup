import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Connecting to Spotify",
    alternates: { canonical: "/spotify/callback" },
    robots: { index: false, follow: false, noarchive: true },
}

export default function SpotifyCallbackLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return children
}
