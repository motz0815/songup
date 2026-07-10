import Link from "next/link"
import { PostCard } from "nextra-theme-blog"
import { getPosts } from "./posts/get-posts"

const LATEST_POSTS_COUNT = 6

export default async function HomePage() {
    const posts = await getPosts()
    const latestPosts = posts.slice(0, LATEST_POSTS_COUNT)

    return (
        <div className="blog-home" data-pagefind-ignore="all">
            <section className="blog-intro">
                <h1>SongUp Blog</h1>
                <p>
                    Product updates, hosting tips, and music ideas for better
                    parties, bars, and events.
                </p>
            </section>

            <section className="latest-posts" aria-labelledby="latest-posts">
                <div className="section-heading">
                    <h2 id="latest-posts">Latest posts</h2>
                    <Link href="/posts" className="text-link">
                        View all <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="post-list">
                    {latestPosts.map((post) => (
                        <article className="post-card" key={post.route}>
                            <PostCard post={post} />
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
