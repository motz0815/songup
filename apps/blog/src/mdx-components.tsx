import { useMDXComponents as getBlogMDXComponents } from "nextra-theme-blog"

const blogComponents = getBlogMDXComponents({
    DateFormatter: ({ date }: { date: Date }) =>
        `Published on ${date.toLocaleDateString("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })}`,
})

export function useMDXComponents(components: any) {
    return {
        ...blogComponents,
        ...components,
    }
}
