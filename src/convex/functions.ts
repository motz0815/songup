/* eslint-disable no-restricted-imports */
import {
    internalMutation as rawInternalMutation,
    mutation as rawMutation,
    internalAction,
} from "./_generated/server"
/* eslint-enable no-restricted-imports */
import { v } from "convex/values"
import {
    customCtx,
    customMutation,
} from "convex-helpers/server/customFunctions"
import { Triggers } from "convex-helpers/server/triggers"
import { DataModel } from "./_generated/dataModel"
import { internal } from "./_generated/api"

type AddSongData = { videoId: string, playlistId: string };

// start using Triggers, with table types from schema.ts
const triggers = new Triggers<DataModel>()

// Cascade delete all songs in a room when the room is deleted
triggers.register("rooms", async (ctx, change) => {
    console.log("Rooms changed", change)
    if (change.operation === "delete") {
        console.log("Deleting leftovers from room")
        if (change.oldDoc.playlistId) {
            // @ts-ignore 
            ctx.scheduler.runAfter(0, internal.functions.deleteRoomPlaylist, {
                roomId: change.oldDoc._id,
                playlistId: change.oldDoc.playlistId,
            })
        }
        for await (const song of ctx.db
            .query("queuedSongs")
            .withIndex("by_room_type", (q) => q.eq("room", change.id))
        ) {
            await ctx.db.delete(song._id)
        }
        for await (const song of ctx.db
            .query("history")
            .withIndex("by_room", (q) => q.eq("room", change.id))
        ) {
            await ctx.db.delete(song._id)
        }
    }
})

// create wrappers that replace the built-in `mutation` and `internalMutation`
// the wrappers override `ctx` so that `ctx.db.insert`, `ctx.db.patch`, etc. run registered trigger functions
export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB))
export const internalMutation = customMutation(
    rawInternalMutation,
    customCtx(triggers.wrapDB),
)

export const addSongToPlaylist = internalAction({
    args : {
        roomId: v.id("rooms"),
        videoId: v.optional(v.string()),
        playlistId: v.optional(v.string()),
    },
    handler: async (_, args) => {
        // add to history playlist
        if (!args.videoId || !args.playlistId) return
        const payload: AddSongData = { videoId: args.videoId, playlistId: args.playlistId };
        const res = await fetch(`/api/rooms/${args.roomId}/playlist`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",  
            },
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Failed to add song");
        } else {
            console.log(`Successfully added song to playlist ${args.playlistId}`)
        }
    }
})

export const deleteRoomPlaylist = internalAction({
    args : {
        roomId: v.id("rooms"),
        playlistId: v.optional(v.string())
    },
    handler: async (_, args) => {
        if (!args.playlistId) return
        const payload = { playlistId: args.playlistId }
        const res = await fetch(`/api/rooms/${args.roomId.toString()}/playlist`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",  
            },
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Failed to delete playlist");
        }
    }
})