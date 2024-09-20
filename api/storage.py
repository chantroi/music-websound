import requests
from s3fs import S3FileSystem
from env import S3_ENDPOINT, S3_KEY, S3_SECRET

def get_data(url):
    req = requests.get(url, timeout=500)
    return req.content

class Storage:
    def __init__(self):

        self.fs = S3FileSystem(endpoint_url=S3_ENDPOINT, key=S3_KEY, secret=S3_SECRET)

    def put(self, title, url):
        print("GETTING DATA FROM: ", url)
        path = f"bosuutap/music/{title}.mp3"
        content = get_data(url)
        print("DONE! UPLOADING...")
        with self.fs.open(path, "wb") as f:
            f.write(content)
        self.fs.setxattr(path, copy_kwargs={"ContentType": "audio/mpeg"})
        print("UPLOAD SUCCESS!")

    def get(self, title):
        path = f"bosuutap/music/{title}.mp3"
        return self.fs.url(path, expires=600000)

    def exists(self, title):
        path = f"bosuutap/music/{title}.mp3"
        return self.fs.exists(path)
