import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ConvexClientProvider } from "./convex-client-provider"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConvexAuthNextjsServerProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
    )
}
