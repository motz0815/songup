import { HostBackground } from "@/components/host/background"
import { Loader2 } from "lucide-react"

// Shown while the host page resolves its authorization queries. It mirrors the
// room background so the transition lands on the room shell, not the previous
// page and its dialog overlay.
export default function HostLoading() {
    return (
        <div className="relative min-h-screen w-full p-4 text-white lg:h-screen">
            <HostBackground />
            <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 lg:min-h-0">
                <Loader2 className="size-10 animate-spin" />
                <p className="text-2xl font-bold text-shadow-md">
                    Setting up your room...
                </p>
            </div>
        </div>
    )
}
