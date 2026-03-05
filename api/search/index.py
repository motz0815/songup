import os
import json
from ytmusicapi import YTMusic
from dotenv import load_dotenv

load_dotenv(".env.local")

headers_json = os.environ.get("YTMUSIC_HEADERS_JSON")
ytAnon = YTMusic()

def lambda_handler(event, context):
    """Handle search requests"""
    query_params = event.get("queryStringParameters") or {}
    query = query_params.get("q") or query_params.get("query")

    if not query:
        return cors_response({"error": "Query is required"}, 400)

    import asyncio
    async def search():
        results = await asyncio.to_thread(lambda: ytAnon.search(query, filter="videos"))
        results = sorted(results, key=lambda x: "UGC" in x.get("videoType", ""))
        return results[:5]

    results = asyncio.run(search())
    return cors_response(results, 200)

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
