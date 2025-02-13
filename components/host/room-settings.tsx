"use client"

import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import { roomSettingsSchema } from "@/lib/schema/room-settings"
import { ActionState, initialState } from "@/types/action-state"
import { useActionState } from "react"
import { Label } from "../ui/label"

interface RoomSettingsFormProps {
    action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}

export function RoomSettingsForm({ action }: RoomSettingsFormProps) {
    const [state, formAction] = useActionState(action, initialState)

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label htmlFor="max_songs_per_user">Max songs per user</Label>
                <Input
                    name="max_songs_per_user"
                    type="number"
                    defaultValue={2}
                    min={1}
                />
                <p className="text-sm text-gray-500">
                    {roomSettingsSchema.shape.max_songs_per_user.description}
                </p>
            </div>
            {state?.error && (
                <p className="text-sm text-red-600">{state.error}</p>
            )}
            <SubmitButton className="w-fit self-end">
                Save settings
            </SubmitButton>
        </form>
    )
}
