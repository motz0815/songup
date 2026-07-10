import { normalizePages } from "nextra/normalize-pages"
import { getPageMap } from "nextra/page-map"

export type PostFrontMatter = {
    title?: string
    date: string
    description?: string
    author?: string
    tags?: string[]
}

export async function getPosts() {
    const { directories } = normalizePages({
        list: await getPageMap("/posts"),
        route: "/posts",
    })
    return directories
        .filter((post) => post.name !== "index")
        .sort((a, b) => {
            const dateA = new Date(
                (a.frontMatter as PostFrontMatter | undefined)?.date ?? 0,
            ).getTime()
            const dateB = new Date(
                (b.frontMatter as PostFrontMatter | undefined)?.date ?? 0,
            ).getTime()
            return dateB - dateA
        })
}

export async function getTags() {
    const posts = await getPosts()
    return posts.flatMap(
        (post) => (post.frontMatter as PostFrontMatter | undefined)?.tags ?? [],
    )
}
