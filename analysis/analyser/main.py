from os import listdir
import sys, os, shutil
from distutils.dir_util import copy_tree
from pathlib import Path
from configparser import ConfigParser
import pandas as pd

from Cleanse import Cleanse
from CommentsAndPosts import CommentsPosts
from WordFreq import WordFreq
from MongoDB import MongoDB as db
from logger import log



def main(db, comments, posts):
    # Clean dataset
    cleansed = Cleanse(comments, posts, stopwords, db.getBannedUsers())
    comments, posts = cleansed.getData()

    # Check if subreddit doc exists
    db.SubredditExist(subreddit)
    
    ##########################
    #### CommentsAndPosts ####
    ##########################

    # Number of comments and posts on a subreddit
    com_post = CommentsPosts(comments, posts) 
    no_comments, no_posts = com_post.getNumCommentsPosts()
    db.SetNumPostComments(subreddit, no_comments, no_posts)

    # Number of comments and posts per day
    sub_doc = db.getDocuments("testing", subreddit)    
    old_cpbd = None
    if sub_doc.count() > 0:
        old_cpbd = db.queryCPBD(subreddit)
    cpbd = com_post.getCommentsPostsByDay(old_cpbd)
    db.setCommentsPostsByDay(cpbd, subreddit)

    # Subreddit activity
    one_day_change, one_day_total = com_post.CommentsPostsActivity(1)
    seven_day_change, seven_day_total = com_post.CommentsPostsActivity(7)
    thirty_day_change, thirty_day_total = com_post.CommentsPostsActivity(30)
    db.SetCommentsPostsActivity( 
        subreddit, 
        one_day_total, 
        one_day_change, 
        seven_day_total, 
        seven_day_change, 
        thirty_day_total, 
        thirty_day_change)
    

def RemoveFiles():
    LATEST_PATH = parser.get('path', 'LatestDirectory')
    shutil.rmtree(LATEST_PATH)
    if not os.path.exists(LATEST_PATH):
        os.makedirs(LATEST_PATH)

if __name__ == "__main__":
    
    # Connect to DB
    db = db("mongodb://localhost:27017/")

    parser = ConfigParser()
    if len(sys.argv) > 1:
        parser.read(sys.argv[1])
    else:
        parser.read('config.conf')
    # Load subreddit list
    subreddits = pd.DataFrame.from_records(data=db.getSubreddits())
    # Copy files from latest to working directory
    copy_tree(parser.get('path', 'LatestDirectory'), parser.get('path', 'WorkingDirectory'))
    # Remove files from latest directory
    RemoveFiles()
    # Loop through subreddits
    for i, row in subreddits.iterrows():
        # Get a List of files in working directory
        subreddit = row["Subreddit"]
        files = listdir(parser.get('path', 'WorkingDirectory'))
        file_name = "comments_"+subreddit+".csv"

        if file_name in files:
            
            comments_path = "{0}comments_{1}.csv".format(parser.get('path', 'WorkingDirectory'), subreddit)            
            posts_path = "{0}posts_{1}.csv".format(parser.get('path', 'WorkingDirectory'), subreddit)
            
            stopwords = pd.DataFrame.from_records(data=db.getStopwords())         
            cryptocurrencies = pd.DataFrame.from_records(data=db.getCryptocurrencies())          
            
            log("Processing: "+ subreddit +" | Files remaining: " + str(len(files)), returnline=True)

            # if comments file exists load it
            if Path(comments_path).is_file():
                comments = pd.read_csv(comments_path)
            # else create empty dataframe
            else:
                comments = pd.DataFrame(columns=['Author','Body','Date','Score'])
            
            # if posts file exists load it    
            if Path(posts_path).is_file():
                posts = pd.read_csv(posts_path)
            # else create empty dataframe
            else:
                posts = pd.DataFrame(columns=['Author','Title','Date','Score'])
            
            # Remove comments and posts files
            # try:
            #     os.remove(comments_path)
            #     os.remove(posts_path)
            # except OSError:
            #     pass

            # if no comments and posts in dataframes return
            if posts.size < 1 and comments.size < 1:
                log("No comments or posts found, returning.", newline=True)
                continue

            main(db, comments, posts)

    
