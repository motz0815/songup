import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    rewrites: async () => {
        return [
            // In production there is deliberately no `/api/*` rule. The Python
            // API is a Vercel Function in this same deployment (`api/index.py`)
            // and is reached directly on the same origin; a rewrite here would
            // shadow it and send the request off the deployment instead.
            //
            // `next dev` has no Python runtime, though, so locally we point at
            // a uvicorn running the same app:
            //     uvicorn api.index:app --reload --port 5328
            ...(process.env.NODE_ENV === "development"
                ? [
                      {
                          source: "/api/:path*",
                          destination: `${
                              process.env.NEXT_PUBLIC_FASTAPI_URL ??
                              "http://127.0.0.1:5328"
                          }/api/:path*`,
                      },
                  ]
                : []),
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
        ],
    },
    skipTrailingSlashRedirect: true,
}

export default nextConfig
