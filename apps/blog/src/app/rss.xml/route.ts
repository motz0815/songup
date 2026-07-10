import { getSiteUrl } from "@/lib/site-url"
import { getPosts, type PostFrontMatter } from "../posts/get-posts"

const SITE_URL = getSiteUrl()

const CONFIG = {
    title: "SongUp Blog",
    siteUrl: `${SITE_URL}/blog`,
    description: "Latest posts from the SongUp blog",
    lang: "en-us",
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
}

export async function GET() {
    const allPosts = await getPosts()
    const posts = allPosts
        .map((post) => {
            const fm = post.frontMatter as PostFrontMatter | undefined
            return `    <item>
        <title>${escapeXml(String(post.title ?? ""))}</title>
        <description>${escapeXml(fm?.description ?? "")}</description>
        <link>${escapeXml(`${SITE_URL}/blog${post.route}`)}</link>
        <pubDate>${new Date(fm?.date ?? 0).toUTCString()}</pubDate>
    </item>`
        })
        .join("\n")

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
${posts}
  </channel>
</rss>`

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml",
        },
    })
}
