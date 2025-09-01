"use client"

import { useTheme } from "next-themes"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Toaster as Sonner, ToasterProps, toast } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (!searchParams) return
        const success = searchParams.get("success")
        const success_description = searchParams.get("success_description")
        const info = searchParams.get("info")
        const info_description = searchParams.get("info_description")
        const warning = searchParams.get("warning")
        const warning_description = searchParams.get("warning_description")
        const error = searchParams.get("error")
        const error_description = searchParams.get("error_description")

        if (success || info || warning || error) {
            if (success) {
                toast.success(success, {
                    description: success_description,
                })
            } else if (info) {
                toast.info(info, {
                    description: info_description,
                })
            } else if (warning) {
                toast.warning(warning, {
                    description: warning_description,
                })
            } else if (error) {
                toast.error(error, {
                    description: error_description,
                })
            }
            // Clear any 'error', 'status', 'status_description', and 'error_description' search params
            // so that the toast doesn't show up again on refresh, but leave any other search params
            // intact.
            const newSearchParams = new URLSearchParams(searchParams.toString())
            const paramsToRemove = [
                "error",
                "info",
                "warning",
                "success",
                "info_description",
                "warning_description",
                "success_description",
                "error_description",
            ]
            paramsToRemove.forEach((param) => newSearchParams.delete(param))
            const redirectPath = `${pathname}?${newSearchParams.toString()}`
            router.replace(redirectPath, { scroll: false })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                } as React.CSSProperties
            }
            {...props}
        />
    )
}

export { Toaster }
