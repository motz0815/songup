import next from "eslint-config-next"

const eslintConfig = [
    ...next,
    {
        rules: {
            "@next/next/no-html-link-for-pages": "off",
        },
    },
]

export default eslintConfig
