import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { UserButton } from "../auth/user-button"
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
                                                href="/why"
                                                title="Introduction"
                                            >
                                                Re-usable components built with
                                                Tailwind CSS.
                                            </ListItem>
                                            <ListItem
                                                href="/docs/installation"
                                                title="Installation"
                                            >
                                                How to install dependencies and
                                                structure your app.
                                            </ListItem>
                                            <ListItem
                                                href="/docs/primitives/typography"
                                                title="Typography"
                                            >
                                                Styles for headings, paragraphs,
                                                lists...etc
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link href="/pricing">Pricing</Link>
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
                <div className="hidden md:block">
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
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="leading-none font-medium">{title}</div>
                        <div className="text-muted-foreground line-clamp-2">
                            {children}
                        </div>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
