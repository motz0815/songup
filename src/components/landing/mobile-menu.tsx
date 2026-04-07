"use client"

import { UserButton } from "@/components/auth/user-button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "../ui/button"

const navItems = [
    {
        section: "Use Cases",
        links: [
            {
                href: "/#parties",
                title: "Parties",
                description:
                    "SongUp makes queuing songs at a party fairer than ever",
            },
            {
                href: "/#gatherings",
                title: "Gatherings",
                description:
                    "Using SongUp at meetings and gatherings makes everyone feel included",
            },
            {
                href: "/blog",
                title: "Blog",
                description:
                    "Explore even more reasons to use SongUp in our blog",
            },
        ],
    },
    {
        section: "More",
        links: [
            {
                href: "/#pricing",
                title: "Pricing",
                description: "Simple, transparent pricing for every use case",
            },
        ],
    },
]

export function MobileMenu() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button aria-label="Open menu" variant="ghost" size="icon">
                    <MenuIcon />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="dark w-72 border-white/20 bg-black/50 text-white backdrop-blur-lg"
                showCloseButton={false}
            >
                <SheetHeader className="h-16 justify-center border-b border-white/20">
                    <SheetTitle className="text-xl font-bold text-white">
                        SongUp
                    </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 p-4">
                    {navItems.map((section) => (
                        <div
                            key={section.section}
                            className="flex flex-col gap-2"
                        >
                            <p className="text-xs font-semibold tracking-wider text-white/50 uppercase">
                                {section.section}
                            </p>
                            <ul className="flex flex-col gap-1">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <SheetClose asChild>
                                            <Link
                                                href={link.href}
                                                className="flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10"
                                            >
                                                <span className="font-medium">
                                                    {link.title}
                                                </span>
                                                <span className="line-clamp-2 text-xs text-white/60">
                                                    {link.description}
                                                </span>
                                            </Link>
                                        </SheetClose>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
                <SheetFooter className="flex-col gap-2 border-t border-white/20 p-4">
                    <SheetClose asChild>
                        <Link href="/host" className="w-full">
                            <Button variant="outline" className="w-full">
                                Manage rooms
                            </Button>
                        </Link>
                    </SheetClose>
                    <UserButton />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
