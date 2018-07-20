import sys
sys.path.append('../')

from Cleanse import Cleanse
from mockdf import MockDF
from MongoDB import MongoDB as db
import pandas as pd
import os

from configparser import ConfigParser
parser = ConfigParser()
parser.read('../config.conf')

# Connect to DB
if os.environ['ENV'] == "test":
    url = "mongodb://mongo/"
else:
    url = parser.get('db', 'url')
db = db(url)

mock = MockDF()
dataframe = mock.getDataframe()

bannedusers = db.getBannedUsers()
stopwords = pd.DataFrame.from_records(data=db.getStopwords())

def test_cleanse():
    clean = Cleanse(dataframe, dataframe, stopwords, bannedusers)
    comments, posts = clean.getData()
    assert isinstance(posts, pd.DataFrame)
    assert isinstance(comments, pd.DataFrame)
    assert len(posts.index) > 0
    assert len(comments.index) > 0
    assert "Author" in posts
    assert "Author" in comments
    assert "Text" in posts
    assert "Text" in comments
    assert "Date" in posts
    assert "Date" in comments
    assert "Score" in posts
    assert "Score" in comments

