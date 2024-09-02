from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)


def search_zingmp3(query):
    results = requests.get(
        "https://ac.zingmp3.vn/v1/web/ac-suggestions",
        params={"query": query},
        timeout=10,
        headers={"X-Forwarded-For": "127.0.0.1"},
    ).json()
    results = results["data"]["items"][1]["suggestions"]

    def pretify(item):
        return {
            "title": item["title"],
            "url": item["link"],
            "cover": item["thumb"],
            "artist": item["artists"][0]["name"],
            "lrc": item.get("lyricLink"),
        }

    results = list(map(pretify, results))
    return results


@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "POST":
        query = request.json.get("query")
    else:
        query = request.args.get("query")
    results = search_zingmp3(query)
    return jsonify(results)
