import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/discord",
        },
        host: "https://democratune.timkolesnichenko.me",
        sitemap: "https://democratune.timkolesnichenko.me/sitemap.xml",
    }
}
