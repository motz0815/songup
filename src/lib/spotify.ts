/**
 * Spotify export, run entirely in the listener's browser.
 *
 * This uses Authorization Code with PKCE rather than the classic code flow,
 * which means there is no client secret and therefore no server-side callback
 * to host. That is not just convenient: DemocraTune's whole pitch is that it
 * doesn't want your accounts, and this way the access token lives in one tab's
 * sessionStorage and is never sent to us. We couldn't leak it if we tried.
 *
 * Setup: register an app at developer.spotify.com, add
 * `<origin>/spotify/callback` as a redirect URI, and set
 * NEXT_PUBLIC_SPOTIFY_CLIENT_ID. Spotify requires redirect URIs to be https,
 * with the sole exception of `http://127.0.0.1:<port>` for local development -
 * `localhost` is no longer accepted.
 */

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"
const API = "https://api.spotify.com/v1"

/** Enough to create a playlist and add to it, and nothing else. */
const SCOPES = ["playlist-modify-private", "playlist-modify-public"]

const VERIFIER_KEY = "spotify.verifier"
const RETURN_KEY = "spotify.return"
const TOKEN_KEY = "spotify.token"

/** Spotify's cap on how many tracks one add request may carry. */
const ADD_BATCH_SIZE = 100

/** A search hit has to be within this much of the known duration to be it. */
const DURATION_TOLERANCE_SECONDS = 8

export const SPOTIFY_CLIENT_ID =
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? ""

export function spotifyConfigured(): boolean {
    return SPOTIFY_CLIENT_ID.length > 0
}

function redirectUri(): string {
    return `${window.location.origin}/spotify/callback`
}

/*
 * PKCE
 */

function randomString(length: number): string {
    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
    const bytes = crypto.getRandomValues(new Uint8Array(length))
    return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("")
}

function base64Url(bytes: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(bytes)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}

async function challengeFor(verifier: string): Promise<string> {
    const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(verifier),
    )
    return base64Url(digest)
}

/** Sends the browser to Spotify. Returns to `returnTo` when it's done. */
export async function beginAuthorization(returnTo: string): Promise<void> {
    const verifier = randomString(64)
    sessionStorage.setItem(VERIFIER_KEY, verifier)
    sessionStorage.setItem(RETURN_KEY, returnTo)

    const params = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: redirectUri(),
        code_challenge_method: "S256",
        code_challenge: await challengeFor(verifier),
        scope: SCOPES.join(" "),
    })

    window.location.href = `${AUTH_ENDPOINT}?${params}`
}

type StoredToken = { accessToken: string; expiresAt: number }

/**
 * Trades the code Spotify sent back for an access token.
 *
 * Returns where the user was before they were sent off to authorize, so the
 * callback page can put them back.
 */
export async function completeAuthorization(code: string): Promise<string> {
    const verifier = sessionStorage.getItem(VERIFIER_KEY)
    if (!verifier) {
        throw new Error("This sign-in didn't start here. Try again.")
    }

    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: SPOTIFY_CLIENT_ID,
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri(),
            code_verifier: verifier,
        }),
    })

    if (!response.ok) {
        throw new Error("Spotify wouldn't complete the sign-in.")
    }

    const body = (await response.json()) as {
        access_token: string
        expires_in: number
    }

    const token: StoredToken = {
        accessToken: body.access_token,
        // Expire a minute early so a long export can't die mid-flight.
        expiresAt: Date.now() + (body.expires_in - 60) * 1000,
    }
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token))
    sessionStorage.removeItem(VERIFIER_KEY)

    const returnTo = sessionStorage.getItem(RETURN_KEY) ?? "/"
    sessionStorage.removeItem(RETURN_KEY)
    return returnTo
}

/**
 * The current access token, or null.
 *
 * There is deliberately no refresh token kept around. An export takes seconds,
 * an hour of validity is plenty, and storing one would mean holding standing
 * access to someone's account long after they've left the party.
 */
export function currentToken(): string | null {
    const raw = sessionStorage.getItem(TOKEN_KEY)
    if (!raw) return null

    try {
        const token = JSON.parse(raw) as StoredToken
        if (token.expiresAt <= Date.now()) {
            sessionStorage.removeItem(TOKEN_KEY)
            return null
        }
        return token.accessToken
    } catch {
        sessionStorage.removeItem(TOKEN_KEY)
        return null
    }
}

export function forgetToken(): void {
    sessionStorage.removeItem(TOKEN_KEY)
}

/*
 * API
 */

async function call<T>(
    token: string,
    path: string,
    init?: RequestInit,
): Promise<T> {
    const response = await fetch(`${API}${path}`, {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    if (response.status === 401) {
        forgetToken()
        throw new Error("Your Spotify session expired. Connect again.")
    }

    if (response.status === 403) {
        // The usual cause is an app still in development mode, where only
        // users the developer has explicitly added may authorize.
        throw new Error(
            "Spotify refused the request. If this app is still in development mode, your account has to be added to it first.",
        )
    }

    if (!response.ok) {
        throw new Error(`Spotify request failed (${response.status})`)
    }

    return (await response.json()) as T
}

export type ResolvableTrack = {
    key: string
    title: string
    artist: string
    duration: number
    spotifyId?: string
}

/** Strips the decoration YouTube uploads carry and Spotify's catalogue doesn't. */
function searchable(value: string): string {
    return value
        .replace(/\([^)]*\)|\[[^\]]*\]/g, " ")
        .replace(/\s*[-–—]\s*(official|lyric|audio|video).*$/i, " ")
        .replace(/["']/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

type SearchResponse = {
    tracks?: {
        items?: Array<{
            id: string
            uri: string
            name: string
            duration_ms: number
            artists?: Array<{ name: string }>
        }>
    }
}

/**
 * Finds the Spotify URI for one track, or null if there's no confident match.
 *
 * Returning null is a perfectly good outcome. A wrong song silently added to
 * someone's playlist is worse than a song missing from it, so anything that
 * doesn't line up on duration is dropped rather than guessed at.
 */
export async function resolveTrack(
    token: string,
    track: ResolvableTrack,
): Promise<string | null> {
    if (track.spotifyId) return `spotify:track:${track.spotifyId}`

    const title = searchable(track.title)
    const artist = searchable(track.artist)

    // Field filters first, because they're far more precise. If the artist
    // string came from a YouTube upload it may not be an artist Spotify knows,
    // in which case the loose query is the one that finds it.
    const queries = [
        `track:${title} artist:${artist}`,
        `${title} ${artist}`,
    ]

    for (const query of queries) {
        const params = new URLSearchParams({
            q: query,
            type: "track",
            limit: "10",
        })

        const body = await call<SearchResponse>(
            token,
            `/search?${params}`,
        )
        const items = body.tracks?.items ?? []
        if (items.length === 0) continue

        const match = items.find((item) => {
            const drift = Math.abs(item.duration_ms / 1000 - track.duration)
            return drift <= DURATION_TOLERANCE_SECONDS
        })

        if (match) return match.uri
    }

    return null
}

export type ExportProgress = {
    resolved: number
    total: number
}

export type ExportResult = {
    playlistUrl: string
    added: number
    missed: ResolvableTrack[]
}

/**
 * Builds a private Spotify playlist from a list of tracks.
 *
 * Resolution happens before the playlist is created, so a run that finds
 * nothing doesn't leave an empty playlist behind in someone's account.
 */
export async function exportPlaylist(
    token: string,
    name: string,
    description: string,
    tracks: ResolvableTrack[],
    onProgress?: (progress: ExportProgress) => void,
): Promise<ExportResult> {
    const uris: string[] = []
    const missed: ResolvableTrack[] = []

    for (const [index, track] of tracks.entries()) {
        try {
            const uri = await resolveTrack(token, track)
            if (uri) uris.push(uri)
            else missed.push(track)
        } catch (error) {
            // A single failed lookup shouldn't lose the other forty songs.
            if (error instanceof Error && /session expired/.test(error.message)) {
                throw error
            }
            missed.push(track)
        }
        onProgress?.({ resolved: index + 1, total: tracks.length })
    }

    if (uris.length === 0) {
        throw new Error("None of these songs could be found on Spotify.")
    }

    const me = await call<{ id: string }>(token, "/me")

    const playlist = await call<{
        id: string
        external_urls: { spotify: string }
    }>(token, `/users/${encodeURIComponent(me.id)}/playlists`, {
        method: "POST",
        body: JSON.stringify({ name, description, public: false }),
    })

    for (let index = 0; index < uris.length; index += ADD_BATCH_SIZE) {
        await call(token, `/playlists/${playlist.id}/tracks`, {
            method: "POST",
            body: JSON.stringify({
                uris: uris.slice(index, index + ADD_BATCH_SIZE),
            }),
        })
    }

    return {
        playlistUrl: playlist.external_urls.spotify,
        added: uris.length,
        missed,
    }
}
