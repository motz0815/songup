import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://democratune.timkolesnichenko.me/",
            lastModified: "2026-08-15",
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: "https://democratune.timkolesnichenko.me/privacy",
            lastModified: "2026-08-13",
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: "https://democratune.timkolesnichenko.me/terms",
            lastModified: "2026-08-13",
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ]
}
