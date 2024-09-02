import os, sys

os.environ["SECRET"] = ""
sys.path.append(os.getcwd())
from main import app as application
