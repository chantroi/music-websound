import requests
from s3fs import S3FileSystem
from env import S3_ENDPOINT, S3_KEY, S3_SECRET


class Storage:
    def __init__(self):

        self.fs = S3FileSystem(
            endpoint_url=S3_ENDPOINT, key=S3_KEY, secret=S3_SECRET
        )

    def put(self, title, url):
        path = f"bosuutap/music/{title}.mp3"
        content = requests.get(url, timeout=100).content
        with self.fs.open(path, "wb") as f:
            f.write(content)
        self.fs.setxattr(path, copy_kwargs={"ContentType": "audio/mpeg"})

    def put_lrc(self, title, url):
        path = f"bosuutap/music/lrc/{title}.lrc"
        content = requests.get(url, timeout=100).text
        with self.fs.open(path, "w") as f:
            f.write(content)
        self.fs.setxattr(path, copy_kwargs={"ContentType": "text/plain"})

    def get(self, title):
        path = f"bosuutap/music/{title}.mp3"
        return self.fs.url(path)

    def get_lrc(self, title):
        path = f"bosuutap/music/lrc/{title}.lrc"
        return self.fs.url(path)

    def exists(self, title):
        path = f"bosuutap/music/{title}.mp3"
        return self.fs.exists(path)
