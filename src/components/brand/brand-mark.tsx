import { cn } from "@/lib/utils"

export function BrandMark({
    className,
    compact = false,
}: {
    className?: string
    compact?: boolean
}) {
    return (
        <span
            className={cn(
                "font-display inline-flex items-baseline font-extrabold tracking-[-0.075em]",
                className,
            )}
            aria-label="DemocraTune"
        >
            <span aria-hidden="true">Democra</span>
            <span className="text-signal" aria-hidden="true">
                Tune
            </span>
            {!compact && (
                <span
                    className="font-code ml-2 text-[0.24em] font-semibold tracking-[0.18em] uppercase opacity-65"
                    aria-hidden="true"
                >
                    the room decides
                </span>
            )}
        </span>
    )
}
