import { cn } from "@/lib/utils"

export function RoomCode({
    code,
    className,
    label = "Room code",
}: {
    code: string
    className?: string
    label?: string
}) {
    return (
        <div className={cn("inline-flex flex-col", className)}>
            <span
                className="font-code flex gap-[0.1em] text-[clamp(2.5rem,8vw,6rem)] leading-none font-bold tracking-[-0.08em]"
                aria-label={`${label}: ${code}`}
            >
                {code.split("").map((character, index) => (
                    <span
                        key={`${character}-${index}`}
                        aria-hidden="true"
                        className="animate-rise-in relative inline-block px-[0.04em] pb-[0.18em] after:absolute after:inset-x-[0.04em] after:bottom-0 after:h-[0.055em] after:bg-current"
                        style={{ animationDelay: `${index * 70}ms` }}
                    >
                        {character}
                    </span>
                ))}
            </span>
        </div>
    )
}
