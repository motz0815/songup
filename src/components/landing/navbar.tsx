import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { UserButton } from "../auth/user-button"
import { Button } from "../ui/button"
import { MobileMenu } from "./mobile-menu"

export async function LandingNavbar() {
    return (
        <nav className="dark sticky top-0 z-10 h-16 w-full border-b border-white/20 bg-white/10 px-4 text-white backdrop-blur-lg md:px-6">
            <div className="flex h-full items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-2xl font-bold">
                        SongUp
                    </Link>

                    {/* Desktop navigation — hidden on mobile */}
                    <div className="hidden md:block">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        Use Cases
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="w-96">
                                            <ListItem
                                                href="/#parties"
                                                title="Parties"
                                            >
                                                SongUp makes queuing songs at a
                                                party fairer than ever
                                            </ListItem>
                                            <ListItem
                                                href="/#gatherings"
                                                title="Gatherings"
                                            >
                                                Using SongUp at meetings and
                                                gatherings makes everyone feel
                                                included
                                            </ListItem>
                                            <ListItem
                                                href="/blog"
                                                title="Blog"
                                                arrow
                                            >
                                                Explore even more reasons to use
                                                SongUp in our blog
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link href="/#pricing">Pricing</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
                {/* Mobile hamburger — hidden on md+ */}
                <div className="md:hidden">
                    <MobileMenu />
                </div>
                {/* Desktop user button — hidden on mobile */}
                <div className="hidden items-center gap-2 md:flex">
                    <Link href="/host">
                        <Button variant="ghost">Manage rooms</Button>
                    </Link>
                    <UserButton />
                </div>
            </div>
        </nav>
    )
}

function ListItem({
    title,
    children,
    href,
    arrow = false,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; arrow?: boolean }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-end gap-1">
                            <div className="leading-none font-medium">
                                {title}
                            </div>
                            {arrow && (
                                <ArrowRightIcon className="text-foreground size-3" />
                            )}
                        </div>

                        <div className="text-muted-foreground line-clamp-2">
                            {children}
                        </div>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
