import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://songup.tv",
            lastModified: new Date(),
            priority: 1,
        },
    ]
}
