"use client"

import { api } from "@/convex/_generated/api"
import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"
import { FaGoogle } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export function UserButton() {
    const { signIn, signOut } = useAuthActions()
    const user = useQuery(api.auth.getCurrentUser)

    return (
        <>
            {user && !user.isAnonymous ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="lg" className="h-12">
                            <Avatar className="size-8 rounded-lg">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback className="rounded-lg">
                                    {user.name?.charAt(0) || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-8 rounded-lg">
                                    <AvatarImage
                                        src={user.image}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {user.name?.charAt(0) || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => void signOut()}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                        void signIn("google", { redirectTo: "/host" })
                    }
                >
                    <FaGoogle className="size-4" />
                    Sign in with Google
                </Button>
            )}
        </>
    )
}
