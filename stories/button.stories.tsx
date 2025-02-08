import type { Meta, StoryObj } from "@storybook/react"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Displays a button or a component that looks like a button.
 */
const meta = {
    title: "ui/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
        children: {
            control: "text",
        },
        variant: {
            control: "select",
            options: [
                "default",
                "outline",
                "ghost",
                "secondary",
                "destructive",
                "link",
            ],
        },
        size: {
            control: "select",
            options: ["default", "sm", "lg", "icon"],
        },
        loading: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        asChild: {
            table: {
                disable: true,
            },
        },
    },
    parameters: {
        layout: "centered",
    },
    args: {
        variant: "default",
        size: "default",
        children: "Button",
        loading: false,
        disabled: false,
    },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the button, used for primary actions and commands.
 */
export const Default: Story = {
    args: {},
}

/**
 * Use the `outline` button to reduce emphasis on secondary actions, such as
 * canceling or dismissing a dialog.
 */
export const Outline: Story = {
    args: {
        variant: "outline",
    },
}

/**
 * Use the `ghost` button is minimalistic and subtle, for less intrusive
 * actions.
 */
export const Ghost: Story = {
    args: {
        variant: "ghost",
    },
}

/**
 * Use the `secondary` button to call for less emphasized actions, styled to
 * complement the primary button while being less conspicuous.
 */
export const Secondary: Story = {
    args: {
        variant: "secondary",
    },
}

/**
 * Use the `destructive` button to indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
    args: {
        variant: "destructive",
    },
}

/**
 * Use the `link` button to reduce emphasis on tertiary actions, such as
 * hyperlink or navigation, providing a text-only interactive element.
 */
export const Link: Story = {
    args: {
        variant: "link",
    },
}

/**
 * Add the `loading` prop to a button to show a loading indicator,
 * such as a spinner, to signify an in-progress action.
 */
export const Loading: Story = {
    args: {
        loading: true,
    },
}

/**
 * Add an icon element to a button to enhance visual communication and
 * providing additional context for the action.
 */
export const WithIcon: Story = {
    render: (args) => (
        <Button {...args}>
            <Mail /> Login with Email Button
        </Button>
    ),
}

/**
 * Use the `sm` size for a smaller button, suitable for interfaces needing
 * compact elements without sacrificing usability.
 */
export const Small: Story = {
    args: {
        size: "sm",
    },
}

/**
 * Use the `lg` size for a larger button, offering better visibility and
 * easier interaction for users.
 */
export const Large: Story = {
    args: {
        size: "lg",
    },
}

/**
 * Use the "icon" size for a button with only an icon.
 */
export const Icon: Story = {
    args: {
        size: "icon",
        children: <Mail />,
    },
}

/**
 * Add the `disabled` prop to prevent interactions with the button.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
    },
}
