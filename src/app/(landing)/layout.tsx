import { LandingNavbar } from "@/components/landing/navbar"

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <LandingNavbar />
            {children}
        </>
    )
}
