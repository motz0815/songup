import next from "eslint-config-next"

const eslintConfig = [
    ...next,
    {
        rules: {
            // React Compiler diagnostics (eslint-plugin-react-hooks v7) are
            // advisory here — this app doesn't run the React Compiler, and
            // these patterns ship fine. Keep them as warnings so the classic
            // `rules-of-hooks` check stays enforced without blocking the build
            // on pre-existing code.
            "react-hooks/static-components": "warn",
            "react-hooks/use-memo": "warn",
            "react-hooks/void-use-memo": "warn",
            "react-hooks/component-hook-factories": "warn",
            "react-hooks/preserve-manual-memoization": "warn",
            "react-hooks/immutability": "warn",
            "react-hooks/globals": "warn",
            "react-hooks/refs": "warn",
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/error-boundaries": "warn",
            "react-hooks/purity": "warn",
            "react-hooks/set-state-in-render": "warn",
            "react-hooks/config": "warn",
            "react-hooks/gating": "warn",
        },
    },
]

export default eslintConfig
