import pandas as pd
from Cleanse import Cleanse
from CommentsAndPosts import CommentsPosts
from WordFreq import WordFreq
from pymongo import MongoClient

# Connect to DB
client = MongoClient("mongodb://localhost:27017/")
db = client.dev

def getBannedUsers():
    banned = db.misc.find({},{"banned_users": 1})
    return banned[0]["banned_users"]

def getStopwords():
    stopwords = db.misc.find({},{"stopwords": 1})
    return stopwords[0]["stopwords"]

stopwords = pd.DataFrame.from_records(data=getStopwords())    
comments = pd.read_csv("comments_btc.csv") 
posts = pd.read_csv("posts_btc.csv") 

cleanse = Cleanse(comments, posts, stopwords, getBannedUsers()) 
comments, posts = cleanse.getData()
wf = WordFreq(comments, posts)
wf.WordFreqByDay()
# CommentsPosts = CommentsPosts(comments, posts)
# CommentsPostsByDay = CommentsPosts.CommentsPostsByDay()
# CommentsPostsActivity = CommentsPosts.CommentsPostsActivity(1)
# print(CommentsPostsActivity)
