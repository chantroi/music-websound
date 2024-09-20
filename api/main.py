from flask import Flask, jsonify, request
from flask_cors import CORS
from db import Db
from storage import Storage
from util import search_youtube, search_zingmp3, get_info

app = Flask(__name__)
CORS(app)
fs = Storage()
db = Db()
@app.route("/")
def index():
    return jsonify(status="ok", message="API is running")


@app.route("/album/create", methods=["POST", "GET"])
def create_album_handler():
    if request.method == "POST":
        title = request.json.get("title")
        author = request.json.get("author")
        des = request.json.get("des")
    else:
        title = request.args.get("title")
        author = request.args.get("author")
        des = request.args.get("des")
    db.create_album(title, author, des)
    return jsonify(status="ok", message="Album created")


@app.route("/albums", methods=["POST", "GET"])
def list_albums_handler():
    albums = db.list_albums()
    albums = [
        {"title": item.title, "author": item.author, "des": item.des} for item in albums
    ]
    return jsonify(albums)


@app.route("/search/zing", methods=["POST", "GET"])
def search_zing_handler():
    if request.method == "POST":
        query = request.json.get("query")
    else:
        query = request.args.get("query")
    results = search_zingmp3(query)
    return jsonify(results)


@app.route("/search/youtube", methods=["POST", "GET"])
def search_yt_handler():
    if request.method == "POST":
        query = request.json.get("query")
    else:
        query = request.args.get("query")
    results = search_youtube(query)
    return jsonify(results)


@app.route("/get", methods=["POST", "GET"])
def get_music_handler():
    if request.method == "POST":
        title = request.json.get("title")
    else:
        title = request.args.get("title")
    audio = db.get_audio(title)
    audio_url = fs.get(title)
    return jsonify(
        title=title,
        url=audio_url,
        cover=audio.cover,
        artist=audio.artist,
        lrc=audio.lrc,
    )


@app.route("/list", methods=["POST", "GET"])
def get_album_handler():
    if request.method == "POST":
        album = request.json.get("album")
    else:
        album = request.args.get("album")
    if album:
        audios = [item.audio for item in db.get_album(album)]
    else:
        audios = [item.audio for item in db.get_album()]
    return jsonify(audios)


@app.route("/save/zing", methods=["POST", "GET"])
def save_zingmp3():
    if request.method == "POST":
        link = request.json.get("url")
        album = request.json.get("album")
    else:
        link = request.args.get("url")
        album = request.args.get("album")
    if not album:
        album = "default"
    info = get_info(link)
    title = info["title"]
    artist = info["artist"]
    url = info["url"]
    cover = info["thumbnails"][0]["url"]
    try:
        lrc = info["subtitles"]["origin"][0]["url"]
    except TypeError:
        lrc = None
    if not db.get_audio(title):
        db.add_audio(title, url, artist, cover, lrc)
    if not fs.exists(title):
        fs.put(title, url)
    db.add_album(album, title)
    return jsonify(
        platform="zingmp3", title=title, url=url, cover=cover, artist=artist, lrc=lrc
    )


@app.route("/save/youtube", methods=["POST", "GET"])
def save_youtube():
    if request.method == "POST":
        album = request.json.get("album")
        link = request.json.get("url")
    else:
        album = request.args.get("album")
        link = request.args.get("url")
    if not album:
        album = "default"
    info = get_info(link)
    url = info["url"]
    title = info["title"]
    cover = info["thumbnail"]
    artist = info["channel"]
    if not db.get_audio(title):
        db.add_audio(title, link, artist, cover)
    if not fs.exists(title):
        fs.put(title, url)
    db.add_album(album, title)
    return jsonify(
        platform="youtube", title=title, url=url, cover=cover, artist=artist, lrc=None
    )
