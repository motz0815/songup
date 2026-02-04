import os
import json
import asyncio
from pydantic import BaseModel
from ytmusicapi import YTMusic, setup as setupYTMusic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from convex import ConvexClient

load_dotenv(".env.local")

app = FastAPI()
headers_json = os.environ.get("YTMUSIC_HEADERS_JSON")
yt = YTMusic(setupYTMusic(headers_raw=headers_json))
ytAnon = YTMusic()
convex = ConvexClient(os.environ.get("NEXT_PUBLIC_CONVEX_URL"))

@app.options("/rooms/{room_id}/playlist")
async def playlist_options(room_id: str):
    print(f"OPTIONS preflight for room {room_id}")
    return JSONResponse(content={"ok": True})


# ------------------------------
# Middleware
# ------------------------------
from fastapi.middleware.cors import CORSMiddleware

# Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
if (os.environ.get("NEXT_PUBLIC_SITE_URL") and os.environ.get("NEXT_PUBLIC_SITE_URL").strip() != ""):
    frontendUrl = os.environ.get("NEXT_PUBLIC_SITE_URL") 
# If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
elif (os.environ.get("NEXT_PUBLIC_VERCEL_URL") and os.environ.get("NEXT_PUBLIC_VERCEL_URL").split() != ""):
    frontendUrl = os.environ.get("NEXT_PUBLIC_VERCEL_URL")
else:
    #If neither is set, default to localhost for local development.
    frontendUrl = "http://localhost:3000"

origins = [
    "https://democratune.timkolesnichenko.me",  # prod
    "http://localhost:3000",                     # local dev
    frontendUrl,
]

print(frontendUrl)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # allow PUT, POST, GET, etc.
    allow_headers=["*"],
)



# ------------------------------
# Models
# ------------------------------
class PlaylistData(BaseModel):
    title: str | None = None
    description: str | None = None

class AddSongData(BaseModel):
    playlistId: str
    videoId: str

class DeletePlaylistData(BaseModel):
    playlistId: str

# ------------------------------
# Helper functions (async wrappers)
# ------------------------------
async def search_videos(query: str):
    results = await asyncio.to_thread(lambda: ytAnon.search(query, filter="videos"))
    
    # Sort results so that official videos appear first, UGC videos last
    results = sorted(results, key=lambda x: "UGC" in x.get("videoType", ""))

    # Limit to 5 results
    return results[:5]

async def get_mood_categories():
    return await asyncio.to_thread(lambda: ytAnon.get_mood_categories()["Moods & moments"])

async def get_mood_playlists(category: str):
    return await asyncio.to_thread(lambda: ytAnon.get_mood_playlists(category)[:15])

async def get_playlist(playlist_id: str):
    return await asyncio.to_thread(lambda: ytAnon.get_playlist(playlist_id))

async def create_playlist(title: str, description: str):
    return await asyncio.to_thread(lambda: yt.create_playlist(title, description, privacy_status="UNLISTED"))

async def delete_playlist(playlist_id: str):
    return await asyncio.to_thread(lambda: yt.delete_playlist(playlist_id))

async def add_playlist_items(playlist_id: str, video_ids: list[str]):
    return await asyncio.to_thread(lambda: yt.add_playlist_items(playlist_id, video_ids))

# ------------------------------
# Routes
# ------------------------------
@app.get("/search")
async def search(query: str):
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    results = await search_videos(query)
    return JSONResponse(content=results)

@app.get("/get-mood-categories")
async def get_mood_categories_route():
    categories = await get_mood_categories()
    response = JSONResponse(content=categories)
    response.headers["Cache-Control"] = "public, max-age=86400"  # 24h
    return response

@app.get("/get-mood-playlists")
async def get_mood_playlists_route(mood_category: str):
    if not mood_category:
        raise HTTPException(status_code=400, detail="Mood category is required")
    playlists = await get_mood_playlists(mood_category)
    response = JSONResponse(content=playlists)
    response.headers["Cache-Control"] = "public, max-age=86400"  # 24h
    return response

@app.get("/get-playlist")
async def get_playlist_route(playlistId: str):
    if not playlistId:
        raise HTTPException(status_code=400, detail="PlaylistID is required")
    playlist = await get_playlist(playlistId)
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return playlist

@app.put("/rooms/{room_id}/playlist")
async def create_room_playlist(room_id: str, data: PlaylistData):
    title = data.title or f"DemocraTune Room {room_id}"
    description = data.description or f"Playlist for room {room_id}"
    playlist_id = await create_playlist(title, description)
    
    # caller saves this mapping
    return {"playlistId": playlist_id}

@app.delete("/rooms/{room_id}/playlist")
async def delete_room_playlist(room_id: str, data: DeletePlaylistData):
    if not data.playlistId:
        raise HTTPException(status_code=404, detail="playlistId is required")

    await delete_playlist(data.playlistId)
    return {"status": "deleted"}

@app.post("/rooms/{room_id}/playlist")
async def add_song(room_id: str, data: AddSongData):
    if not data.videoId:
        raise HTTPException(status_code=400, detail="videoId is required")

    if not data.playlistId:
        raise HTTPException(status_code=404, detail="playlistId is required")

    await add_playlist_items(data.playlistId, [data.videoId])
    return {"status": "added"}