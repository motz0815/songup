import type { NextConfig } from "next"
import path from "node:path"

// The web app is the primary zone and owns the product experience. Only the
// independent Docs and Blog applications are routed to secondary zones.
// See https://nextjs.org/docs/app/guides/multi-zones
const DOCS_DOMAIN =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : (process.env.DOCS_DOMAIN ?? "https://docs.songup.tv")
const BLOG_DOMAIN =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3002"
        : (process.env.BLOG_DOMAIN ?? "https://blog.songup.tv")

const nextConfig: NextConfig = {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    transpilePackages: ["@songup/ui", "@songup/backend"],
    rewrites: async () => {
        return [
            {
                source: "/relay-iljT/static/:path*",
                destination: "https://eu-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/relay-iljT/:path*",
                destination: "https://eu.i.posthog.com/:path*",
            },
            {
                source: "/flask/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:5328/flask/:path*"
                        : "/api/flask/index",
            },
            // Secondary zones and their uniquely prefixed Next.js assets.
            { source: "/blog", destination: `${BLOG_DOMAIN}/blog` },
            {
                source: "/blog/:path+",
                destination: `${BLOG_DOMAIN}/blog/:path+`,
            },
            {
                source: "/blog-static/:path+",
                destination: `${BLOG_DOMAIN}/blog-static/:path+`,
            },
            { source: "/docs", destination: `${DOCS_DOMAIN}/docs` },
            {
                source: "/docs/:path+",
                destination: `${DOCS_DOMAIN}/docs/:path+`,
            },
            {
                source: "/docs-static/:path+",
                destination: `${DOCS_DOMAIN}/docs-static/:path+`,
            },
        ]
    },
    images: {
        remotePatterns: [
            { hostname: "*.googleusercontent.com" },
            { hostname: "*.imgix.net" },
            { hostname: "*.redditstatic.com" },
            { hostname: "styles.redditmedia.com" },
        ],
    },
    skipTrailingSlashRedirect: true,
}

export default nextConfig
