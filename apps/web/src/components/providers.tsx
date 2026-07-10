import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ConvexClientProvider } from "./convex-client-provider"
import { IdentificationProvider } from "./identification-provider"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConvexAuthNextjsServerProvider>
            <ConvexClientProvider>
                <IdentificationProvider>{children}</IdentificationProvider>
            </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
    )
}
