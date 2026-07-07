import next from "eslint-config-next"

const eslintConfig = [
    {
        ignores: ["convex/_generated/**"],
    },
    ...next,
    {
        rules: {
            // Force mutations to go through functions.ts (custom function
            // wrappers) instead of importing the raw `_generated/server` ones.
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
