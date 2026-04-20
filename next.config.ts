import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/flask/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:5328/flask/:path*"
                        : "/api/flask/index",
            },
            {
                source: "/relay-iljT/static/:path*",
                destination: "https://eu-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/relay-iljT/:path*",
                destination: "https://eu.i.posthog.com/:path*",
            },
            {
                source: "/docs",
                destination: `${process.env.DOCS_DOMAIN}/docs`,
            },
            {
                source: "/docs/:path+",
                destination: `${process.env.DOCS_DOMAIN}/docs/:path+`,
            },
            {
                source: "/docs-static/:path+",
                destination: `${process.env.DOCS_DOMAIN}/docs-static/:path+`,
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                hostname: "*.googleusercontent.com",
            },
            {
                hostname: "*.imgix.net",
            },
            {
                hostname: "*.redditstatic.com",
            },
            {
                hostname: "styles.redditmedia.com",
            },
        ],
    },
    skipTrailingSlashRedirect: true,
}

export default nextConfig
