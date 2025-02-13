export type ActionState = {
    ok: boolean
    error?: string
}

export type ActionStateWithData<T> = ActionState & {
    data: T
}

export const initialState: ActionState = {
    ok: true,
    error: undefined,
}
