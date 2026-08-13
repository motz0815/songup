import { cn } from "@/lib/utils"

const BAR_HEIGHTS = [44, 72, 100, 61, 88, 52, 78, 96, 58, 84, 47, 68]

export function TallyField({ className }: { className?: string }) {
    return (
        <div
            className={cn("flex h-full items-end gap-2", className)}
            aria-hidden="true"
        >
            {BAR_HEIGHTS.map((height, index) => (
                <span
                    key={`${height}-${index}`}
                    className="animate-tally block h-full min-w-2 flex-1 origin-bottom bg-current"
                    style={{
                        height: `${height}%`,
                        animationDelay: `${index * -190}ms`,
                    }}
                />
            ))}
        </div>
    )
}
