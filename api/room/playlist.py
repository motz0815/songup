import os
import json
from ytmusicapi import YTMusic
from dotenv import load_dotenv

load_dotenv(".env.local")

headers_json = os.environ.get("YTMUSIC_HEADERS_JSON")
yt = YTMusic(YTMusic.setup(headers_raw=headers_json)) if headers_json else None
ytAnon = YTMusic()

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

def get_room_id_from_path(path):
    """Extract room_id from path like /api/rooms/{room_id}/playlist"""
    path_parts = path.strip("/").split("/")
    for i, part in enumerate(path_parts):
        if part == "rooms" and i + 1 < len(path_parts):
            return path_parts[i + 1]
    return None

def lambda_handler(event, context):
    """Handle playlist-related requests"""
    path = event.get("path", "")
    http_method = event.get("httpMethod", "GET").upper()

    # Handle OPTIONS preflight
    if http_method == "OPTIONS":
        return cors_response({"ok": True}, 200)

    room_id = get_room_id_from_path(path)
    query_params = event.get("queryStringParameters") or {}

    # GET /api/get-playlist?playlistId=...
    if http_method == "GET" and "/get-playlist" in path:
        playlist_id = query_params.get("playlistId")
        if not playlist_id:
            return cors_response({"error": "playlistId is required"}, 400)
        playlist = ytAnon.get_playlist(playlist_id)
        if playlist is None:
            return cors_response({"error": "Playlist not found"}, 404)
        return cors_response(playlist, 200)

    # PUT /api/rooms/{room_id}/playlist - Create playlist
    if http_method == "PUT" and room_id:
        if not yt:
            return cors_response({"error": "Authentication required"}, 401)
        try:
            body = json.loads(event.get("body", "{}"))
        except json.JSONDecodeError:
            return cors_response({"error": "Invalid JSON"}, 400)
        title = body.get("title") or f"DemocraTune Room {room_id}"
        description = body.get("description") or f"Playlist for room {room_id}"
        try:
            playlist_id = yt.create_playlist(title, description, privacy_status="UNLISTED")
            return cors_response({"playlistId": playlist_id}, 200)
        except Exception as e:
            return cors_response({"error": str(e)}, 500)

    # POST /api/rooms/{room_id}/playlist - Add song
    if http_method == "POST" and room_id:
        if not yt:
            return cors_response({"error": "Authentication required"}, 401)
        try:
            body = json.loads(event.get("body", "{}"))
        except json.JSONDecodeError:
            return cors_response({"error": "Invalid JSON"}, 400)
        video_id = body.get("videoId")
        playlist_id = body.get("playlistId")
        if not video_id:
            return cors_response({"error": "videoId is required"}, 400)
        if not playlist_id:
            return cors_response({"error": "playlistId is required"}, 400)
        try:
            yt.add_playlist_items(playlist_id, [video_id])
            return cors_response({"status": "added"}, 200)
        except Exception as e:
            return cors_response({"error": str(e)}, 500)

    # DELETE /api/rooms/{room_id}/playlist - Delete playlist
    if http_method == "DELETE" and room_id:
        if not yt:
            return cors_response({"error": "Authentication required"}, 401)
        try:
            body = json.loads(event.get("body", "{}"))
        except json.JSONDecodeError:
            return cors_response({"error": "Invalid JSON"}, 400)
        playlist_id = body.get("playlistId")
        if not playlist_id:
            return cors_response({"error": "playlistId is required"}, 400)
        try:
            yt.delete_playlist(playlist_id)
            return cors_response({"status": "deleted"}, 200)
        except Exception as e:
            return cors_response({"error": str(e)}, 500)

    return cors_response({"error": "Not found"}, 404)
