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
        section: "Getting Started",
        links: [
            {
                href: "/why",
                title: "Introduction",
                description: "Re-usable components built with Tailwind CSS.",
            },
            {
                href: "/docs/installation",
                title: "Installation",
                description:
                    "How to install dependencies and structure your app.",
            },
            {
                href: "/docs/primitives/typography",
                title: "Typography",
                description: "Styles for headings, paragraphs, lists...etc",
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
            >
                <SheetHeader className="border-b border-white/20 pb-4">
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
                <SheetFooter className="border-t border-white/20 p-4">
                    <UserButton />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
