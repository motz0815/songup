import { LandingNavbar } from "@/components/landing/navbar"

export default function LandingLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <LandingNavbar />
            {children}
        </>
    )
}
