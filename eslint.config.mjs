import { FlatCompat } from "@eslint/eslintrc"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
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
]

export default eslintConfig
