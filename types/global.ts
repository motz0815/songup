import { Database } from "./database"

export type Room = Database["public"]["Tables"]["rooms"]["Row"]
export type Song = Database["public"]["Tables"]["songs"]["Row"]
