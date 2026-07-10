import type { NextConfig } from "next"
import path from "node:path"

// TODO: Remove `--webpack` from the next-dev script once Turbopack no longer
// stalls while compiling this app zone's routes in multi-zone development.
const nextConfig: NextConfig = {
    // This app imports shared workspace packages (@songup/ui, @songup/backend)
    // that live outside its own directory. Point output file tracing at the
    // monorepo root so Vercel bundles those files into the serverless output.
    outputFileTracingRoot: path.join(__dirname, "../../"),
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
