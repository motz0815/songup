"use client"

import { GrainGradient } from "@paper-design/shaders-react"

export function LandingBackground({ speed = 0.75 }: { speed?: number }) {
    return (
        // The -inset-8 is to make the background slightly larger than the screen to avoid any bleeding
        <div className="fixed -inset-8 -z-10 overflow-hidden bg-black">
            <GrainGradient
                style={{ height: "100%" }}
                colorBack="hsl(0, 0%, 0%)"
                softness={0.5}
                intensity={0.5}
                noise={0.25}
                frame={1000 * 8}
                shape="corners"
                offsetX={0}
                offsetY={0}
                scale={1}
                rotation={0}
                speed={speed}
                colors={[
                    "hsl(267, 100%, 50%)",
                    "hsl(286, 100%, 60%)",
                    "hsl(195, 100%, 50%)",
                    "hsl(250, 100%, 50%)",
                ]}
            />
        </div>
    )
}
