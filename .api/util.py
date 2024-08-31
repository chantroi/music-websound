import requests
import yt_dlp
from youtube_search import YoutubeSearch


def search_youtube(query):
    results = YoutubeSearch(query, max_results=1).to_dict()

    def pretify(item):
        url = f"https://youtube.com{item['url_suffix']}"
        return {
            "title": item["title"],
            "url": url,
            "cover": item["thumbnails"][0],
            "artist": item["channel"],
        }

    results = list(map(pretify, results["videos"]))
    return results


def search_zingmp3(query):
    results = requests.get(
        "https://ac.zingmp3.vn/v1/web/ac-suggestions",
        params={"query": query},
        timeout=10,
    ).json()
    results = results["data"]["items"][1]["suggestions"]

    def pretify(item):
        return {
            "title": item["title"],
            "url": item["url"],
            "cover": item["thumbnail"],
            "artist": item["artists"][0]["name"],
            "lrc": item["lyricLink"],
        }

    results = list(map(pretify, results))
    return results


def get_info(url):
    ydl_opts = {
        "format": "bestaudio/best",
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    if hasattr(info, "artist"):
        artist = info["artist"]
    else:
        artist = info["uploader"]
    cover = info["thumbnails"][0]["url"]
    result = {
        "title": info["title"],
        "url": info["url"],
        "cover": cover,
        "artist": artist,
    }

    return result
