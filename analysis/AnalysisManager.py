import pandas as pd
from os import listdir
import sys, os, shutil
from distutils.dir_util import copy_tree
from pathlib import Path
from configparser import ConfigParser

from wordfreq import WordFreq
from cleanse import Cleanse
from commentpost import CommentsPosts
from logger import log


class AnalysisManager(object):

    def __init__(self, db, config):
        self._db = db
        self._config = config
        self._latest_dir = self._config.get('path', 'LatestDirectory')
        self._working_dir = self._config.get('path', 'WorkingDirectory')
        self._subreddits = self.loadSubreddits()
        self._stopwords = self.loadStopwords()
        self._banned_users = self.loadBannedUsers()
        self._cryptocurrencies = self.loadCryptocurrencies()
        self.moveFiles()

        self.comments = None
        self.posts = None
        self.subreddit = None
    
    def loadSubreddits(self):
        log("loading subreddits")
        return pd.DataFrame.from_records(data=self._db.getSubreddits())
    
    def loadStopwords(self):
        log("loading stopwords")        
        return pd.DataFrame.from_records(data=self._db.getStopwords())
    
    def loadCryptocurrencies(self):
        log("loading banned cryptocurrencies")                        
        return pd.DataFrame.from_records(data=self._db.getCryptocurrencies())
    
    def loadBannedUsers(self):
        log("loading banned users")                
        return self._db.getBannedUsers()

    def moveFiles(self):
        log("moving files to working directory")                        
        # move to working dir
        copy_tree(self._latest_dir, self._working_dir)
        # # delete latest dir
        # shutil.rmtree(self._latest_dir)
        # # Recreate empty latest dir
        # if not os.path.exists(self._latest_dir):
        #     os.makedirs(self._latest_dir)
    
    def loadDatasets(self, subreddit):
        log("Loading datasets for {0}".format(subreddit))
        
        comments_path = "{0}comments_{1}.csv".format(self._working_dir, subreddit)
        posts_path = "{0}posts_{1}.csv".format(self._working_dir, subreddit)

        # if comments file exists load it
        if Path(comments_path).is_file():
            self.comments = pd.read_csv(comments_path)
        # else create empty dataframe
        else:
            self.comments = pd.DataFrame(columns=['Author','Body','Date','Score'])
        
        if Path(posts_path).is_file():
            self.posts = pd.read_csv(posts_path)
        # else create empty dataframe
        else:
            self.posts = pd.DataFrame(columns=['Author','Title','Date','Score'])
        
        # Remove comments and posts files
        # try:
        #     os.remove(comments_path)
        #     os.remove(posts_path)
        # except OSError:
        #     pass
        
        if self.posts.size < 1 and self.comments.size < 1:
            log("datasets not large enough")
            return False
        else:
            log("datasets loaded")
            # If datasets are large enough, check if document already exist for 
            # subreddit, if not, one will be created
            self._db.SubredditExist(subreddit)
            self.subreddit = subreddit
            return True
    
    def cleanseDatasets(self):
        log("Cleansing datasets")
        cleanse = Cleanse(self.comments, self.posts, self._stopwords, self._banned_users)
        self.comments, self.posts = cleanse.getData()
    
    def CommentsAndPosts(self):
        # Number of comments and posts on a subreddit
        com_post = CommentsPosts(self.comments, self.posts) 
        no_comments, no_posts = com_post.getNumCommentsPosts()
        self._db.SetNumPostComments(self.subreddit, no_comments, no_posts)
        
        # Number of comments and posts per day
        sub_doc = self._db.getDocuments("commentpostbd", self.subreddit)    
        old_cpbd = None
        if sub_doc.count() > 0:
            old_cpbd = self._db.queryCPBD(self.subreddit)
        cpbd = com_post.getCommentsPostsByDay(old_cpbd)
        self._db.setCommentsPostsByDay(cpbd, self.subreddit)
    
        # Subreddit activity
        one_day_change, one_day_total = com_post.CommentsPostsActivity(1)
        seven_day_change, seven_day_total = com_post.CommentsPostsActivity(7)
        thirty_day_change, thirty_day_total = com_post.CommentsPostsActivity(30)
        self._db.SetCommentsPostsActivity( 
            self.subreddit, 
            one_day_total, 
            one_day_change, 
            seven_day_total, 
            seven_day_change, 
            thirty_day_total, 
            thirty_day_change)
    
    def WordFreq(self):
        
        WF = WordFreq(self.comments, self.posts)        
        
        subreddit_doc = self._db.getDocuments("subreddits", self.subreddit)
        wordfreqbd_doc = self._db.getDocuments("wordfreqbd", self.subreddit)

        old_word_freq = None
        if "word_count" in subreddit_doc:
            old_word_freq = subreddit_doc["word_count"]
        word_freq = WF.getWordFreq(old_word_freq)
        self._db.SetWordFreq(word_freq, self.subreddit)

        old_wfbd = None
        if wordfreqbd_doc.count() > 0:
            old_wfbd = self._db.queryWFBD(self.subreddit)
        wfbd = WF.getWordFreqByDay(old_wfbd)
        self._db.setWordFreqByDay(wfbd, self.subreddit)
        
