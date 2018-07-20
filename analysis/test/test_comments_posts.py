import sys
sys.path.append('../')
from CommentsAndPosts import CommentsPosts
from MongoDB import MongoDB as db
import pandas as pd
from Cleanse import Cleanse
from mockdf import MockDF

mock = MockDF()
dataframe = mock.getDataframe()
db = db("mongodb://localhost:27017/")
bannedusers = db.getBannedUsers()
stopwords = pd.DataFrame.from_records(data=db.getStopwords())
clean = Cleanse(dataframe, dataframe, stopwords, bannedusers)
comments, posts = clean.getData()
com_post = CommentsPosts(comments, posts)  

def test_num_comm_post():
    comments, posts = com_post.getNumCommentsPosts()
    assert isinstance(posts, int)
    assert isinstance(comments, int)
    
def test_comm_post_by_day():
    cpbd = com_post.getCommentsPostsByDay(None)
    assert isinstance(cpbd, list)
    assert len(cpbd) > 0
    assert "Date" in cpbd[0]
    assert "n_comment" in cpbd[0]
    assert "n_post" in cpbd[0]
    

def test_comm_post_by_day_with_old():
    cpbd = com_post.getCommentsPostsByDay(com_post.getCommentsPostsByDay(None))
    assert isinstance(cpbd, list)
    assert len(cpbd) > 0
    assert "Date" in cpbd[0]
    assert "n_comment" in cpbd[0]
    assert "n_post" in cpbd[0]
    
def test_comm_post_activity():
    change, total = com_post.CommentsPostsActivity(7)
    assert isinstance(change, int)
    assert isinstance(total, int)