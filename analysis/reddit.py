#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Gathering reddit posts"""

from logger import log
import csv
import sys
import os
import datetime
from pathlib import Path
from prawcore.exceptions import PrawcoreException
import praw
import json
import pandas as pd
from configparser import ConfigParser

parser = ConfigParser()
parser.read('../config.conf')





def Stream(subs):
    
    # init Reddit instance
    reddit = praw.Reddit(
        client_id=parser.get('reddit', 'client_id'), 
        client_secret=parser.get('reddit', 'client_secret'), 
        password=parser.get('reddit', 'password'), 
        user_agent=parser.get('reddit', 'user_agent'), 
        username=parser.get('reddit', 'username'))


    CommentCounter = 0
    PostCounter = 0

    while True:
        try:
            # Get subreddits
            subreddits = reddit.subreddit(subs)
            # Stream comments recieved to subreddits
            for comment in subreddits.stream.comments():
                # Get post
                submission = comment.submission
                # commentcounter++
                CommentCounter += 1
                # add the comment to the appropriate csv file
                SaveComments(str(submission.subreddit), [comment.id, comment.id, comment.body, comment.created_utc, comment.score, comment.author])
                # Log details
                Logger(submission.subreddit,submission.created_utc, CommentCounter, PostCounter)
                # Get postIDs
                PostIDs = pd.read_csv(parser.get('PostIds', 'path'))
                # Check if already processed
                if PostIDs['ID'].str.contains(submission.id).any():
                    continue
                # Add current postID to data frame and save back to csv
                PostIDs.loc[len(PostIDs)] = submission.id 
                PostIDs.to_csv(parser.get('PostIds', 'path'), sep=',', index=False)
                # Save post to appropriate csv file
                SavePosts(str(submission.subreddit), [submission.id, submission.title, submission.created_utc, submission.score, submission.num_comments, submission.author])
                PostCounter += 1
                Logger(submission.subreddit,submission.created_utc,CommentCounter,PostCounter)

        except KeyboardInterrupt:
            log('Termination received. Goodbye!')
            return False
        except PrawcoreException:
            log(PrawcoreException, newline=True)
            
        
        
        
    



    
        
#Display mining information to the terminal
def Logger(sub,date,CommentCounter,PostCounter):

    date = datetime.datetime.fromtimestamp(date).strftime('%Y-%m-%d %H:%M:%S')
    log("({0}) Posts:{1} - Comments:{2} - Last:{3}".format(sub,PostCounter,CommentCounter,date), returnline=True)

    

def SavePosts(subreddit, posts):
    path = parser.get('LatestFiles', 'path') + '/posts_'+subreddit+'.csv'
    posts_file = Path(path)
    file_exists = posts_file.is_file()        
    f = open(path, 'a')
    try:
        writer = csv.writer(f)        
        if file_exists is False:
            writer.writerow(["ID", "Title", "Date", "Score", "No. Comments", "Author"])
        writer.writerow(posts)
    finally:
        f.close()
        
def SaveComments(subreddit, comments):
    path = parser.get('LatestFiles', 'path') + 'comments_'+subreddit+'.csv'    
    comments_file = Path('../data/reddit/latest/comments_'+subreddit+'.csv')
    file_exists = comments_file.is_file() 
    f = open(path, 'a')
    try:
        writer = csv.writer(f)
        if file_exists is False:
            writer.writerow(["ID", "PostID", "Body", "Date", "Score", "Author"])
        writer.writerow(comments)
    finally:
        f.close()


if __name__ == '__main__':
    subreddits = pd.read_csv(parser.get('subs', 'path'))
    subs = []
    for i, row in subreddits.iterrows():
        subs.append(row["Subreddit"])
    subs = '+'.join(subs)
    Stream(subs)
    