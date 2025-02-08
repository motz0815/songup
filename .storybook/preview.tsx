import { Toaster } from "@/components/ui/toaster"
import "@/styles/globals.css"
import type { Preview } from "@storybook/react"

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        nextjs: {
            appDirectory: true,
        },
    },
    decorators: [
        (Story) => {
            return (
                <div className="bg-background">
                    <Story />
                    <Toaster />
                </div>
            )
        },
    ],
}

export default preview
