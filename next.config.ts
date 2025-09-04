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
        ]
    },
    images: {
        remotePatterns: [
            {
                hostname: "*.googleusercontent.com",
            },
        ],
    },
}

export default nextConfig
