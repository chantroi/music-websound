from flask import Flask, jsonify, request
from flask_cors import CORS
from db import Db
from storage import Storage
from util import search_youtube, search_zingmp3, get_info

app = Flask(__name__)
CORS(app)


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
def get_info_handler():
    if request.method == "POST":
        title = request.json.get("title")
    else:
        title = request.args.get("title")
    db = Db()
    audio = db.get_audio(title)
    fs = Storage()
    audio["url"] = fs.get(title)
    return jsonify(audio)


@app.route("/get/lrc", methods=["POST", "GET"])
def get_lrc_handler():
    if request.method == "POST":
        title = request.json.get("title")
    else:
        title = request.args.get("title")
    fs = Storage()
    lrc = fs.get_lrc(title)
    return jsonify(lrc=lrc)


@app.route("/get/album", methods=["POST", "GET"])
def get_album_handler():
    if request.method == "POST":
        album = request.json.get("album")
    else:
        album = request.args.get("album")
    db = Db()
    if album:
        audios = [item.audio for item in db.get_album(album)]
    else:
        audios = [item.audio for item in db.get_album()]
    return jsonify(audios)


@app.route("/get/zing", methods=["POST", "GET"])
def get_zing_info_handler():
    if request.method == "POST":
        link = request.json.get("url")
        album = request.json.get("album")
    else:
        link = request.args.get("url")
        album = request.args.get("album")
    info = get_info(link)
    title = info["title"]
    artist = info["artist"]
    url = info["url"]
    cover = info["thumbnail"]
    lrc = info["subtitles"]["origin"][0]["url"]
    db = Db()
    if not db.get_audio(title):
        db.add_audio(title, url, artist, cover, lrc)
    fs = Storage()
    if not fs.exists(title):
        fs.put(title, url)
        fs.put_lrc(title, lrc)
    if not (item.audio == title for item in db.get_album(album)):
        db.add_album(album, title)
    return jsonify(
        platform="zingmp3", title=title, url=url, cover=cover, artist=artist, lrc=lrc
    )


@app.route("/get/youtube", methods=["POST", "GET"])
def get_yt_info_handler():
    if request.method == "POST":
        album = request.json.get("album")
        link = request.json.get("url")
    else:
        album = request.args.get("album")
        link = request.args.get("url")
    info = get_info(link)
    url = info["url"]
    title = info["title"]
    cover = info["thumbnail"]
    artist = info["channel"]
    db = Db()
    if not db.get_audio(title):
        db.add_audio(title, link, artist, cover)
    fs = Storage()
    if not fs.exists(title):
        fs.put(title, url)
    if not (item.audio == title for item in db.get_album(album)):
        db.add_album(album, title)
    return jsonify(
        platform="youtube", title=title, url=url, cover=cover, artist=artist, lrc=None
    )
