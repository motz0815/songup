import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    // The app is a secondary multi-zone behind the marketing website
    // (songup.tv). Its build assets are served under /app-static so they
    // don't collide with the primary zone's /_next assets.
    assetPrefix: "/app-static",
    transpilePackages: ["@songup/ui", "@songup/backend"],
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
