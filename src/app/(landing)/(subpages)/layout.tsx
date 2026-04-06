import { LandingBackground } from "@/app/background"

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <LandingBackground speed={0} />
            <div className="dark text-white">{children}</div>
        </>
    )
}
