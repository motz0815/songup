"use client"

import { GrainGradient } from "@paper-design/shaders-react"

export function LandingBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
            <GrainGradient
                style={{ height: "100%" }}
                colorBack="hsl(0, 0%, 0%)"
                softness={0.5}
                intensity={0.5}
                noise={0.25}
                shape="corners"
                offsetX={0}
                offsetY={0}
                scale={1}
                rotation={0}
                speed={0.75}
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
