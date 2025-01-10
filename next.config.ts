import { NextConfig } from "next"

export const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "i.ytimg.com",
            },
            {
                hostname: "is2-ssl.mzstatic.com",
            },
        ],
    },
}
