import fs from "node:fs"
import path from "node:path"
import { getURL } from "@songup/ui/lib/utils"
import type { MetadataRoute } from "next"

// The web app is the primary zone and owns songup.tv. The blog and docs
// apps are secondary zones served from the same domain at /blog and /docs
// (see next.config.ts rewrites), so this is the single sitemap for the
// whole site. Blog posts are discovered from the monorepo checkout at build
// time so new posts show up here automatically without touching this file.

// Minimal frontmatter reader — we only need scalar values (date) and simple
// string arrays (tags), which is all the blog's frontmatter uses. Avoids
// pulling in a YAML dependency just for a build-time sitemap.
function parseFrontmatter(content: string): Record<string, string | string[]> {
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return {}

    const result: Record<string, string | string[]> = {}
    let currentKey: string | null = null

    for (const line of match[1].split("\n")) {
        const arrayItem = line.match(/^\s+-\s+(.+)$/)
        if (arrayItem && currentKey) {
            const value = result[currentKey]
            if (Array.isArray(value)) value.push(arrayItem[1].trim())
            continue
        }

        const keyValue = line.match(/^(\w+):\s*(.*)$/)
        if (!keyValue) continue
        const [, key, value] = keyValue
        if (value.trim() === "") {
            result[key] = []
            currentKey = key
        } else {
            result[key] = value.trim()
            currentKey = null
        }
    }

    return result
}

type BlogPost = { slug: string; lastModified: Date; tags: string[] }

function getBlogPosts(): BlogPost[] {
    const postsDir = path.join(process.cwd(), "../blog/src/app/posts")
    if (!fs.existsSync(postsDir)) return []

    return fs
        .readdirSync(postsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => {
            const filePath = path.join(postsDir, entry.name, "page.mdx")
            if (!fs.existsSync(filePath)) return []

            const frontmatter = parseFrontmatter(
                fs.readFileSync(filePath, "utf-8"),
            )
            const date =
                typeof frontmatter.date === "string"
                    ? new Date(frontmatter.date)
                    : new Date()
            const tags = Array.isArray(frontmatter.tags)
                ? frontmatter.tags
                : []

            return [{ slug: entry.name, lastModified: date, tags }]
        })
}

// Recursively finds every routable page under the docs app's `app/` dir and
// returns its route path (e.g. "/legal/imprint", "" for the root page.mdx),
// so new docs pages show up here automatically without touching this file.
function getDocsPages(): string[] {
    const appDir = path.join(process.cwd(), "../docs/src/app")
    if (!fs.existsSync(appDir)) return []

    const pages: string[] = []

    function walk(dir: string, routePath: string) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (entry.isDirectory()) {
                walk(path.join(dir, entry.name), `${routePath}/${entry.name}`)
            } else if (entry.name === "page.mdx" || entry.name === "page.tsx") {
                pages.push(routePath)
            }
        }
    }

    walk(appDir, "")
    return pages
}

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getBlogPosts()
    const tags = [...new Set(posts.flatMap((post) => post.tags))]
    const docsPages = getDocsPages()
    const now = new Date()

    return [
        {
            url: getURL(),
            lastModified: now,
            priority: 1,
        },
        {
            url: getURL("host"),
            lastModified: now,
            priority: 0.9,
        },
        ...docsPages.map((docPath) => ({
            url: getURL(`docs${docPath}`),
            lastModified: now,
            priority: 0.3,
        })),
        {
            url: getURL("blog"),
            lastModified: now,
            priority: 0.6,
        },
        {
            url: getURL("blog/posts"),
            lastModified: now,
            priority: 0.6,
        },
        ...posts.map((post) => ({
            url: getURL(`blog/posts/${post.slug}`),
            lastModified: post.lastModified,
            priority: 0.7,
        })),
        ...tags.map((tag) => ({
            url: getURL(`blog/tags/${encodeURIComponent(tag)}`),
            lastModified: now,
            priority: 0.4,
        })),
    ]
}
