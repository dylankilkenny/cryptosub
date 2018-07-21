import sys
sys.path.append('../')
from commentpost import CommentsPosts
from db import MongoDB as db
import pandas as pd
from cleanse import Cleanse
from mockdf import MockDF
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

bannedusers = db.get_banned_users()
stopwords = pd.DataFrame.from_records(data=db.get_stopwords())
clean = Cleanse(dataframe, dataframe, stopwords, bannedusers)
comments, posts = clean.get_data()
com_post = CommentsPosts(comments, posts)  

def test_num_comm_post():
    comments, posts = com_post.get_num_comments_posts()
    assert isinstance(posts, int)
    assert isinstance(comments, int)
    
def test_comm_post_by_day():
    cpbd = com_post.get_comments_posts_by_day(None)
    assert isinstance(cpbd, list)
    assert len(cpbd) > 0
    assert "Date" in cpbd[0]
    assert "n_comment" in cpbd[0]
    assert "n_post" in cpbd[0]
    

def test_comm_post_by_day_with_old():
    cpbd = com_post.get_comments_posts_by_day(com_post.get_comments_posts_by_day(None))
    assert isinstance(cpbd, list)
    assert len(cpbd) > 0
    assert "Date" in cpbd[0]
    assert "n_comment" in cpbd[0]
    assert "n_post" in cpbd[0]
    
def test_comm_post_activity():
    change, total = com_post.get_comments_posts_activity(7)
    assert isinstance(change, int)
    assert isinstance(total, int)