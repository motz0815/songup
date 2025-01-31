"use client"

import { useEffect, useState } from "react"
import { Gradient } from "whatamesh"

export function HostBackground({ videoId }: { videoId?: string }) {
    const [colors, setColors] = useState<string[]>([])
    const defaultColors = ["#FF3CAC", "#784BA0", "#2B86C5", "#FF3CAC"]
    const canvasId = "gradient-canvas"

    useEffect(() => {
        const url = videoId && `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`

        if (url) {
            fetch(`/api/colors?url=${encodeURIComponent(url)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.colors && data.colors.length === 4) {
                        setColors(data.colors)
                    }
                })
                .catch(console.error)
        }
    }, [videoId])

    useEffect(() => {
        const gradient = new Gradient()
        const canvas = document.getElementById(canvasId)
        const activeColors = colors.length > 0 ? colors : defaultColors

        if (canvas) {
            // Set the gradient colors using CSS variables
            activeColors.forEach((color, index) => {
                canvas.style.setProperty(`--gradient-color-${index + 1}`, color)
            })
        }

        // Initialize the gradient
        gradient.initGradient("#" + canvasId)

        return () => {
            // Clean up if needed
            if (canvas) {
                Array.from({ length: 4 }).forEach((_, index: number) => {
                    canvas.style.removeProperty(`--gradient-color-${index + 1}`)
                })
            }
        }
    }, [colors])

    return (
        <canvas
            id={canvasId}
            className="absolute left-0 top-0 -z-10 h-full w-full transition-all duration-1000"
            data-transition-in
        />
    )
}
