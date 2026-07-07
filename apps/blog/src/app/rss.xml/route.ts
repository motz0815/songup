import { getPosts, type PostFrontMatter } from "../posts/get-posts"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://songup.tv"

const CONFIG = {
    title: "SongUp Blog",
    siteUrl: `${SITE_URL}/blog`,
    description: "Latest posts from the SongUp blog",
    lang: "en-us",
}

export async function GET() {
    const allPosts = await getPosts()
    const posts = allPosts
        .map((post) => {
            const fm = post.frontMatter as PostFrontMatter | undefined
            return `    <item>
        <title>${post.title}</title>
        <description>${fm?.description ?? ""}</description>
        <link>${SITE_URL}/blog${post.route}</link>
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
