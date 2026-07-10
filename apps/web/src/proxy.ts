import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"

export default convexAuthNextjsMiddleware((request, { convexAuth }) => {}, {
    cookieConfig: {
        maxAge: 60 * 60 * 24 * 30, // 30 days cookie expiration
    },
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
