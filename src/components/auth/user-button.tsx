"use client"

import { api } from "@/convex/_generated/api"
import { useAuthActions } from "@convex-dev/auth/react"
import { useAction, useConvexAuth, useQuery } from "convex/react"
import { ChevronsUpDown, CreditCard, LogOut } from "lucide-react"
import { toast } from "sonner"
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
import { Skeleton } from "../ui/skeleton"
import { SignInButton } from "./sign-in-button"

export function UserButton() {
    const { signOut } = useAuthActions()
    const { isLoading } = useConvexAuth()
    const user = useQuery(api.auth.getCurrentUser)

    const getPortalUrl = useAction(api.stripe.getCustomerPortalUrl)

    async function manageBilling() {
        try {
            const result = await getPortalUrl({})
            if (result?.url) {
                window.location.href = result.url
            } else {
                toast.warning("Can't manage billing", {
                    description:
                        "You can't manage billing because you've never made a purchase!",
                })
            }
        } catch (error) {
            console.error("Portal error:", error)
            toast.error("Failed to open billing portal")
        }
    }

    return (
        <>
            {isLoading ? (
                <Skeleton className="h-12 w-48 rounded-lg" />
            ) : (
                <>
                    {user && !user.isAnonymous ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12"
                                >
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
                                    {/* <DropdownMenuItem>
                                        <User />
                                        Account
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem onClick={manageBilling}>
                                        <CreditCard />
                                        Billing
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => void signOut()}
                                >
                                    <LogOut />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <SignInButton variant="outline" size="lg" />
                    )}
                </>
            )}
        </>
    )
}
