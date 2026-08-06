"use client"

import { cn } from "@/lib/utils"

export type SchedulerOption = "FCFS" | "roundRobin" | "weighted"

/**
 * The three schedulers, described by what a guest at the party would notice
 * rather than by how the queue is sorted.
 */
const SCHEDULERS: {
    value: SchedulerOption
    name: string
    summary: string
}[] = [
    {
        value: "FCFS",
        name: "First come, first served",
        summary: "Songs play in the order they were added.",
    },
    {
        value: "roundRobin",
        name: "Round robin",
        summary: "One song from each person in turn, so nobody dominates.",
    },
    {
        value: "weighted",
        name: "DemocraSchedule",
        summary:
            "Round robin, but people whose songs the room votes up get their turn more often.",
    },
]

export function SchedulerPicker({
    value,
    onChange,
}: {
    value: SchedulerOption
    onChange: (value: SchedulerOption) => void
}) {
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">
                How songs are picked
            </legend>
            {SCHEDULERS.map((scheduler) => {
                const selected = scheduler.value === value
                return (
                    <label
                        key={scheduler.value}
                        className={cn(
                            "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors motion-reduce:transition-none",
                            "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                            selected
                                ? "border-primary bg-primary/5"
                                : "border-input hover:bg-accent",
                        )}
                    >
                        <input
                            type="radio"
                            name="scheduler"
                            value={scheduler.value}
                            checked={selected}
                            onChange={() => onChange(scheduler.value)}
                            className="mt-1 size-4 shrink-0 accent-primary"
                        />
                        <span className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium">
                                {scheduler.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {scheduler.summary}
                            </span>
                        </span>
                    </label>
                )
            })}
        </fieldset>
    )
}
