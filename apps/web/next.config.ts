import type { NextConfig } from "next"
import path from "node:path"

// The marketing website is the PRIMARY multi-zone. It owns the apex domain
// (songup.tv) and rewrites path prefixes owned by the other zones to their
// deployments. Secondary zones set their own `assetPrefix`; the primary needs
// none. See https://nextjs.org/docs/app/guides/multi-zones
const APP_DOMAIN = process.env.APP_DOMAIN ?? "http://localhost:3001"
const BLOG_DOMAIN = process.env.BLOG_DOMAIN ?? "http://localhost:3003"
const DOCS_DOMAIN = process.env.DOCS_DOMAIN ?? "http://localhost:3002"

const nextConfig: NextConfig = {
    // The website imports shared workspace packages (@songup/ui, and a
    // lightweight @songup/backend client) from outside its own directory.
    // Point output file tracing at the monorepo root so Vercel bundles those
    // files into the serverless output.
    outputFileTracingRoot: path.join(__dirname, "../../"),
    // The website imports shared workspace packages by name (e.g. the CSS
    // `@import "@songup/ui/theme.css"` in globals.css). Turbopack needs these
    // listed here to resolve/transpile files from the package; without it the
    // CSS import fails to resolve and the dev server enters an infinite
    // compile→error loop. Mirrors apps/app.
    transpilePackages: ["@songup/ui", "@songup/backend"],
    rewrites: async () => {
        return [
            // PostHog reverse proxy (the website captures analytics too)
            {
                source: "/relay-iljT/static/:path*",
                destination: "https://eu-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/relay-iljT/:path*",
                destination: "https://eu.i.posthog.com/:path*",
            },
            // App zone (host / room / pay / discord / flask / api + assets)
            { source: "/host", destination: `${APP_DOMAIN}/host` },
            { source: "/host/:path*", destination: `${APP_DOMAIN}/host/:path*` },
            { source: "/room", destination: `${APP_DOMAIN}/room` },
            { source: "/room/:path*", destination: `${APP_DOMAIN}/room/:path*` },
            { source: "/pay", destination: `${APP_DOMAIN}/pay` },
            { source: "/pay/:path*", destination: `${APP_DOMAIN}/pay/:path*` },
            { source: "/discord", destination: `${APP_DOMAIN}/discord` },
            { source: "/flask/:path*", destination: `${APP_DOMAIN}/flask/:path*` },
            { source: "/api/:path*", destination: `${APP_DOMAIN}/api/:path*` },
            {
                source: "/app-static/:path+",
                destination: `${APP_DOMAIN}/app-static/:path+`,
            },
            // Blog zone
            { source: "/blog", destination: `${BLOG_DOMAIN}/blog` },
            { source: "/blog/:path+", destination: `${BLOG_DOMAIN}/blog/:path+` },
            {
                source: "/blog-static/:path+",
                destination: `${BLOG_DOMAIN}/blog-static/:path+`,
            },
            // Docs zone
            { source: "/docs", destination: `${DOCS_DOMAIN}/docs` },
            { source: "/docs/:path+", destination: `${DOCS_DOMAIN}/docs/:path+` },
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
