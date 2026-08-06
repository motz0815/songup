/**
 * Collapsing song titles into a comparable key.
 *
 * Kept free of Convex imports so it can be exercised on its own - it's pure
 * string handling, and the only way to know the rules are right is to run them
 * over real titles.
 */

/**
 * Bracketed suffixes that describe the *upload* rather than the *recording*.
 *
 * Deliberately short. Stripping "(Live)" or "(Acoustic)" would collapse
 * genuinely different recordings into one catalogue entry, and the whole point
 * of the fingerprint is that two rows mean two different things.
 */
const UPLOAD_NOISE =
    /[([]\s*(?:official\s+)?(?:music\s+)?(?:video|audio|lyric video|lyric|lyrics|visualizer|visualiser|mv|hd|hq|4k|explicit|official)\s*[)\]]/gi

/** "feat. X", "ft X", "featuring X" - credited differently on every service. */
const FEATURING = /\s*[([]?\s*(?:feat|ft|featuring)\.?\s[^)\]]*[)\]]?/gi

/** Combining marks left behind by NFD decomposition. */
const COMBINING_MARKS = /[̀-ͯ]/g

function normalise(value: string): string {
    return (
        value
            .toLowerCase()
            // Split accents off their letters so the combining marks can be
            // dropped; "Beyoncé" and "Beyonce" have to land on the same key.
            .normalize("NFD")
            .replace(COMBINING_MARKS, "")
            .replace(UPLOAD_NOISE, " ")
            .replace(FEATURING, " ")
            // Separators go entirely rather than becoming spaces, so "AC/DC",
            // "AC-DC" and "ACDC" agree, as do "T.N.T." and "TNT". Two titles
            // that differ only in punctuation are the same song in practice.
            .replace(/[^a-z0-9]+/g, "")
    )
}

/**
 * Turns a title and artist into a key that survives the same recording being
 * uploaded twice with different decoration.
 *
 * This is intentionally lossy. Its job is to stop the catalogue filling up with
 * near-duplicates, not to be a musicological identity - `isrc` does that job
 * when a provider gives us one.
 */
export function fingerprint(artist: string, title: string): string {
    return `${normalise(artist)}|${normalise(title)}`
}
