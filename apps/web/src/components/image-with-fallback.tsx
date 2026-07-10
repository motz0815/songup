"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"

interface ImageWithFallbackProps extends ImageProps {
    fallback?: ImageProps["src"]
    elementFallback?: React.ReactElement
    elementFallbackClassName?: string
}

const fallbackImage = "/placeholder.svg"

export function ImageWithFallback({
    fallback = fallbackImage,
    elementFallback,
    elementFallbackClassName,
    alt,
    src,
    ...props
}: ImageWithFallbackProps) {
    const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null)
    const error = failedSrc === src

    if (error && elementFallback) {
        return elementFallback
    }

    return (
        <Image
            alt={alt}
            onError={() => setFailedSrc(src)}
            src={error ? fallback : src}
            {...props}
        />
    )
}
