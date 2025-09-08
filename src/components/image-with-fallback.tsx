"use client"

import Image, { ImageProps } from "next/image"
import { useEffect, useState } from "react"

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
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        setError(false)
    }, [src])

    if (error && elementFallback) {
        return elementFallback
    }

    return (
        <Image
            alt={alt}
            onError={() => setError(true)}
            src={error ? fallback : src}
            {...props}
        />
    )
}
