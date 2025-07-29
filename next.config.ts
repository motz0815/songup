import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/api/flask/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:5328/api/:path*"
                        : "/api/",
            },
        ]
    },
}

export default nextConfig
