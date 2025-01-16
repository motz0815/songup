import { Database } from "./database"

export type Room = Database["public"]["Tables"]["rooms"]["Row"]
export type Song = Database["public"]["Tables"]["songs"]["Row"]

export type RoomInsert = Database["public"]["Tables"]["rooms"]["Insert"]
export type SongInsert = Database["public"]["Tables"]["songs"]["Insert"]
