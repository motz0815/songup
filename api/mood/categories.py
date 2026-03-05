import os
import json
from ytmusicapi import YTMusic
from dotenv import load_dotenv

load_dotenv(".env.local")

headers_json = os.environ.get("YTMUSIC_HEADERS_JSON")
ytAnon = YTMusic()

def lambda_handler(event, context):
    """Handle mood categories requests"""
    if event.get("httpMethod") == "OPTIONS":
        return cors_response({"ok": True}, 200)

    categories = ytAnon.get_mood_categories()["Moods & moments"]
    response = cors_response(categories, 200)
    response["headers"]["Cache-Control"] = "public, max-age=86400"
    return response

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
