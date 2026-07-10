import nextra from "nextra"

// Set up Nextra with the blog theme.
const withNextra = nextra({
    defaultShowCopyCode: true,
    readingTime: true,
})

// The blog is a SECONDARY multi-zone served under /blog by the Website. It sets
// its own `assetPrefix` so its `_next` assets resolve through the proxy.
// See https://nextjs.org/docs/app/guides/multi-zones
export default withNextra({
    reactCompiler: true,
    turbopack: {
        resolveAlias: {
            // Path to your `mdx-components` file with extension
            "next-mdx-import-source-file": "./src/mdx-components.tsx",
        },
    },
    assetPrefix: "/blog-static",
    basePath: "/blog",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
        ],
    },
})
