import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://democratune.timkolesnichenko.me",
            lastModified: new Date(),
            priority: 1,
        },
    ]
}
