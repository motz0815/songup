import Link from "next/link"
import { PostCard } from "nextra-theme-blog"
import { getPosts } from "./posts/get-posts"

const LATEST_POSTS_COUNT = 6

export default async function HomePage() {
    const posts = await getPosts()
    const latestPosts = posts.slice(0, LATEST_POSTS_COUNT)

    return (
        <div data-pagefind-ignore="all">
            <h1>SongUp Blog</h1>
            <p>
                Welcome to the SongUp blog — the collaborative song request
                queue for parties, bars, and events. Here we share product
                updates, behind-the-scenes stories, and practical guides for
                hosting unforgettable nights.
            </p>

            <h2>Latest posts</h2>
            {latestPosts.map((post) => (
                <PostCard key={post.route} post={post} />
            ))}

            <p>
                <Link href="/posts">Browse all posts →</Link>
            </p>
        </div>
    )
}
