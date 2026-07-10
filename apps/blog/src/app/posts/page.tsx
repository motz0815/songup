import type { Metadata } from "next"
import Link from "next/link"
import { PostCard } from "nextra-theme-blog"
import { getPosts, getTags } from "./get-posts"

export const metadata: Metadata = {
    title: "Posts",
}

export default async function PostsPage() {
    const tags = await getTags()
    const posts = await getPosts()
    const allTags: Record<string, number> = Object.create(null)

    for (const tag of tags) {
        allTags[tag] ??= 0
        allTags[tag] += 1
    }

    return (
        <div className="posts-page" data-pagefind-ignore="all">
            <h1>Posts</h1>
            <p className="page-intro">
                Hosting guides, music inspiration, and SongUp news.
            </p>
            <div className="tag-list not-prose">
                {Object.entries(allTags).map(([tag, count]) => (
                    <Link
                        key={tag}
                        href={`/tags/${tag}`}
                        className="nextra-tag"
                    >
                        {tag} ({count})
                    </Link>
                ))}
            </div>
            <div className="post-list">
                {posts.map((post) => (
                    <article className="post-card" key={post.route}>
                        <PostCard post={post} />
                    </article>
                ))}
            </div>
        </div>
    )
}
