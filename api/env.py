import os
import requests

SECRET = os.getenv("SECRET")

req = requests.get(SECRET, timeout=10)
res = req.json()
DB_URL = res["db"]["libsql"]
S3_ENDPOINT = res["s3"][4]["endpoint"]
S3_KEY = res["s3"][4]["key"]
S3_SECRET = res["s3"][4]["secret"]