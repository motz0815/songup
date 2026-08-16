import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["*/_generated/server"],
                            importNames: ["mutation", "internalMutation"],
                            message:
                                "Use functions.ts for mutation or internalMutation",
                        },
                    ],
                },
            ],
        },
    },
    globalIgnores([
        ".next/**",
        ".vercel/**",
        "out/**",
        "build/**",
        "coverage/**",
        "playwright-report/**",
        "test-results/**",
        "src/convex/_generated/**",
        "next-env.d.ts",
    ]),
])

export default eslintConfig
