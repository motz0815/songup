import { cn } from "@/lib/utils"

const BAR_HEIGHTS = [
    36, 62, 48, 82, 54, 96, 66, 43, 74, 100, 58, 88, 49, 79, 92, 56, 70, 40,
]

export function TallyField({ className }: { className?: string }) {
    return (
        <div
            className={cn("flex h-full items-end gap-1.5 sm:gap-2", className)}
            aria-hidden="true"
        >
            {BAR_HEIGHTS.map((height, index) => (
                <span
                    key={`${height}-${index}`}
                    className="animate-tally block h-full min-w-1.5 flex-1 origin-bottom bg-current will-change-transform"
                    style={{
                        height: `${height}%`,
                        animationDelay: `${index * -190}ms`,
                        animationDuration: `${2.2 + ((index * 7) % 9) * 0.17}s`,
                    }}
                />
            ))}
        </div>
    )
}
