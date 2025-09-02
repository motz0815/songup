from flask import Flask, jsonify, request
from ytmusicapi import YTMusic

app = Flask(__name__)

@app.route("/flask/python")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/flask/search-example")
def search_example():
    yt = YTMusic()
    results = yt.search("The Weeknd blinding lights", filter="songs", limit=10)
    return jsonify(results)

@app.route("/flask/search", methods=["GET"])
def search():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query is required"}), 400
    yt = YTMusic()
    results = yt.search(query, filter="videos")

    # Filter out UGC videos (User Generated Content)
    results = [result for result in results if not "UGC" in result["videoType"]]

    # Limit to 5 results
    results = results[:5]
    # Loop over results to filter out songs that aren't embeddable
    # TODO is there a better way to do this? 
    # Maybe streaming the results back?
    # In my rudimentary test a request took 1.17s without the filter, while it took 2.93s with filtering enabled.
    # But on the other hand, we kind of *need* to check this, because otherwise we'll get songs that are not embeddable and will fail in the last second.
    results = [result for result in results if yt.get_song(result["videoId"])["playabilityStatus"].get("playableInEmbed", False)]
    print(results)
    return jsonify(results)

@app.route("/flask/search-playlist", methods=["GET"])
def search_playlist():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query is required"}), 400
    yt = YTMusic()
    results = yt.search(query, filter="playlists")
    # Limit to 5 results
    results = results[:5]
    return jsonify(results)

@app.route("/flask/get-playlist", methods=["GET"])
def get_playlist():
    browseId = request.args.get("browseId")
    if not browseId:
        return jsonify({"error": "Browse ID is required"}), 400
    yt = YTMusic()
    playlist = yt.get_playlist(browseId)
    return jsonify(playlist)

@app.route("/flask/get-playlist-info", methods=["GET"])
def get_playlist_info():
    browseId = request.args.get("browseId")
    if not browseId:
        return jsonify({"error": "Browse ID is required"}), 400
    yt = YTMusic()
    playlist = yt.get_playlist(browseId, 0)
    return jsonify(playlist)