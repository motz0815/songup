import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://democratune.timkolesnichenko.me",
            lastModified: new Date(),
            priority: 1,
        },
        {
            url: "https://democratune.timkolesnichenko.me/privacy",
            lastModified: new Date(),
            priority: 0.3,
        },
        {
            url: "https://democratune.timkolesnichenko.me/terms",
            lastModified: new Date(),
            priority: 0.3,
        },
    ]
}
