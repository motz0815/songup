"use client"

import { BrandMark } from "@/components/brand/brand-mark"
import { TallyField } from "@/components/brand/tally-field"
import { JoinRoomForm } from "@/components/room/join-room"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NotFound() {
    const attemptedCode = usePathname().split("/").filter(Boolean).at(-1) ?? ""

    return (
        <main className="paper-field relative flex min-h-screen overflow-hidden px-5 py-6 sm:px-10 sm:py-8">
            <div className="text-broadcast pointer-events-none absolute right-[-8vw] bottom-[-8vh] h-[48vh] w-[42vw] min-w-72 opacity-15">
                <TallyField />
            </div>
            <div className="relative mx-auto flex w-full max-w-6xl flex-col">
                <Link href="/" className="w-fit">
                    <BrandMark compact className="text-2xl sm:text-3xl" />
                </Link>
                <div className="flex flex-1 items-center py-16">
                    <div className="w-full max-w-3xl">
                        <h1 className="font-display max-w-2xl text-5xl leading-[0.9] font-extrabold tracking-[-0.06em] text-balance sm:text-7xl lg:text-8xl">
                            {attemptedCode
                                ? `${attemptedCode.toUpperCase()} isn’t on air.`
                                : "That room isn’t on air."}
                        </h1>
                        <p className="text-ink/65 mt-5 max-w-xl text-lg sm:text-xl">
                            Check the code with your host, then tune in again.
                            Codes use four letters or numbers.
                        </p>
                        <JoinRoomForm
                            defaultCode={attemptedCode.slice(0, 4)}
                            className="mt-10"
                        />
                        <Link
                            href="/"
                            className="mt-8 inline-flex items-center gap-2 font-semibold underline decoration-2 underline-offset-4"
                        >
                            <ArrowLeft className="size-4" /> Back to DemocraTune
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
