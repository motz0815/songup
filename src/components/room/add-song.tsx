"use client"

import { PlusIcon } from "lucide-react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"

export function AddSong({ disabled = false }: { disabled: boolean }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={disabled}>
                    <PlusIcon /> Add Song
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Song</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
