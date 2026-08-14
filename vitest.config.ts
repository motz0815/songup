import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./tests/setup.ts"],
        include: ["tests/unit/**/*.test.ts", "tests/functional/**/*.test.tsx"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            include: ["src/lib/**/*.ts", "src/convex/fingerprint.ts", "src/convex/settings.ts"],
        },
    },
})
