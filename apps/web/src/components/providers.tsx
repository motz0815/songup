import { ConvexClientProvider } from "./convex-client-provider"

export function Providers({ children }: { children: React.ReactNode }) {
    return <ConvexClientProvider>{children}</ConvexClientProvider>
}
