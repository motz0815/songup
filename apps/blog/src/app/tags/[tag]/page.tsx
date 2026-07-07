import type { Metadata } from "next"
import { PostCard } from "nextra-theme-blog"
import { getPosts, getTags, type PostFrontMatter } from "../../posts/get-posts"

type Params = { tag: string }

export async function generateMetadata(props: {
    params: Promise<Params>
}): Promise<Metadata> {
    const params = await props.params
    return {
        title: `Posts tagged with “${decodeURIComponent(params.tag)}”`,
    }
}

export async function generateStaticParams() {
    const allTags = await getTags()
    return [...new Set(allTags)].map((tag) => ({ tag }))
}

export default async function TagPage(props: { params: Promise<Params> }) {
    const params = await props.params
    const tag = decodeURIComponent(params.tag)
    const posts = await getPosts()

    return (
        <>
            <h1>Posts tagged with “{tag}”</h1>
            {posts
                .filter((post) =>
                    (
                        (post.frontMatter as PostFrontMatter | undefined)
                            ?.tags ?? []
                    ).includes(tag),
                )
                .map((post) => (
                    <PostCard key={post.route} post={post} />
                ))}
        </>
    )
}
