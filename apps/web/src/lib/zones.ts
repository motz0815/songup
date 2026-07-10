// Path prefixes owned by OTHER multi-zone deployments (see the rewrites in
// apps/web/next.config.ts). Links to these routes must use a plain <a> so the
// browser performs a full navigation through the zone rewrite. Using next/link
// would trigger a client-side App Router transition/prefetch that 404s, since
// the route does not exist inside the website zone.
const CROSS_ZONE_PREFIXES = ["/blog", "/docs"]

export function isCrossZoneHref(href: string): boolean {
    return CROSS_ZONE_PREFIXES.some(
        (prefix) => href === prefix || href.startsWith(`${prefix}/`),
    )
}
