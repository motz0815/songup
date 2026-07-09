import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"

export default convexAuthNextjsMiddleware((request, { convexAuth }) => {}, {
    cookieConfig: {
        maxAge: 60 * 60 * 24 * 30, // 30 days cookie expiration
    },
})

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets. The app's assets are intentionally served through
    // /app-static by the primary multi-zone, so exclude that namespace too.
    matcher: ["/((?!.*\\..*|_next|app-static).*)", "/", "/(api|trpc)(.*)"],
}
