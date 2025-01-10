import { NextConfig } from "next"

export default {
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
} satisfies NextConfig
