import os
import json
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from ytmusicapi import YTMusic
from dotenv import load_dotenv

load_dotenv(".env.local")

headers_json = os.environ.get("YTMUSIC_HEADERS_JSON")
ytAnon = YTMusic()

# How many results to ask YouTube Music for. We over-fetch because a good share
# of them turn out to be un-embeddable and get dropped by the check below.
SEARCH_LIMIT = 20
# How many of the ranked candidates to check. All checks run at once, so this
# bounds the endpoint at roughly one round trip rather than one per song.
VERIFY_LIMIT = 12
# How many verified results to hand back to the client.
RESULT_LIMIT = 8
VERIFY_TIMEOUT_SECONDS = 3

# YouTube Music tags every result with a videoType. ATV entries are the
# auto-generated "art track" uploads that back the audio-only catalogue; the
# labels that own them almost always disallow embedded playback, so they show up
# in search, get queued, and then fail with error 150 on the host screen.
# Prefer real videos, and treat art tracks as a last resort.
VIDEO_TYPE_RANK = {
    "MUSIC_VIDEO_TYPE_OMV": 0,          # official music video
    "MUSIC_VIDEO_TYPE_OFFICIAL_SOURCE_MUSIC": 1,
    "MUSIC_VIDEO_TYPE_UGC": 2,          # user upload
    "MUSIC_VIDEO_TYPE_ATV": 3,          # art track - usually embed-blocked
}
UNRANKED = len(VIDEO_TYPE_RANK)


def lambda_handler(event, context):
    """Handle search requests"""
    if event.get("httpMethod") == "OPTIONS":
        return cors_response({"ok": True}, 200)

    query_params = event.get("queryStringParameters") or {}
    query = query_params.get("q") or query_params.get("query")

    if not query:
        return cors_response({"error": "Query is required"}, 400)

    try:
        raw = ytAnon.search(query, filter="videos", limit=SEARCH_LIMIT)
    except Exception as exc:  # noqa: BLE001 - upstream failures shouldn't 500
        print(f"YouTube Music search failed for {query!r}: {exc}")
        return cors_response({"error": "Search is temporarily unavailable"}, 502)

    candidates = [song for song in (normalize(item) for item in raw) if song]
    candidates.sort(key=lambda song: song["_rank"])

    results = verify_embeddable(candidates, RESULT_LIMIT)

    for song in results:
        song.pop("_rank", None)

    return cors_response(results, 200)


def normalize(item):
    """Reshape a raw search hit, or return None if it isn't queueable."""
    if not isinstance(item, dict):
        return None

    video_id = item.get("videoId")
    duration = item.get("duration_seconds")

    # Both are required to queue a song: without a duration the queue can't show
    # or schedule it, and without an id there is nothing to play.
    if not video_id or not duration:
        return None

    artists = [
        {"name": artist["name"]}
        for artist in (item.get("artists") or [])
        if isinstance(artist, dict) and artist.get("name")
    ]

    video_type = item.get("videoType") or ""

    return {
        "videoId": video_id,
        "title": item.get("title") or "Unknown title",
        "artists": artists or [{"name": "Unknown artist"}],
        "duration_seconds": int(duration),
        "videoType": video_type,
        "_rank": VIDEO_TYPE_RANK.get(video_type, UNRANKED),
    }


def verify_embeddable(candidates, wanted):
    """
    Keep only songs that will actually play inside an iframe.

    YouTube's oEmbed endpoint answers 401 when the owner has disabled embedded
    playback and 404 when the video is private or gone, which is the cheapest
    way to find out without an API key. Checks run in parallel and in rank
    order, so we stop as soon as we have enough good results.
    """
    if not candidates:
        return []

    checked = candidates[:VERIFY_LIMIT]
    with ThreadPoolExecutor(max_workers=len(checked)) as pool:
        outcomes = list(pool.map(is_embeddable, checked))

    verified = [song for song, ok in zip(checked, outcomes) if ok]

    # If every candidate failed the check the endpoint is probably rate limiting
    # us rather than the songs all being blocked. Fall back to the ranked list so
    # search still returns something instead of looking broken.
    return (verified or checked)[:wanted]


def is_embeddable(song):
    url = "https://www.youtube.com/oembed?" + urllib.parse.urlencode(
        {
            "url": f"https://www.youtube.com/watch?v={song['videoId']}",
            "format": "json",
        }
    )
    request = urllib.request.Request(url, headers={"User-Agent": "DemocraTune"})
    try:
        with urllib.request.urlopen(request, timeout=VERIFY_TIMEOUT_SECONDS) as response:
            return response.status == 200
    except urllib.error.HTTPError:
        # 401 = embedding disabled, 403 = restricted, 404 = private or removed.
        return False
    except Exception:  # noqa: BLE001 - timeouts, DNS, TLS
        # Don't punish a song for our own network trouble.
        return True


def cors_response(data, status=200):
    """Add CORS headers to response"""
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": get_cors_origin(),
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
        "body": json.dumps(data)
    }


def get_cors_origin():
    """Determine allowed CORS origin"""
    site_url = os.environ.get("NEXT_PUBLIC_SITE_URL")
    if site_url and site_url.strip():
        return site_url.strip()

    vercel_url = os.environ.get("NEXT_PUBLIC_VERCEL_URL")
    if vercel_url and vercel_url.strip():
        return f"https://{vercel_url.strip()}"

    return "http://localhost:3000"
