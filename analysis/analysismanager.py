import pandas as pd
from os import listdir
import sys, os, shutil
from distutils.dir_util import copy_tree
from pathlib import Path
from configparser import ConfigParser

from wordfreq import WordFreq
from bigramfreq import BigramFreq
from currencymention import CurrencyMention
from cleanse import Cleanse
from commentpost import CommentsPosts
from logger import log


class AnalysisManager(object):
    def __init__(self, db, config, historical=None):
        self._db = db
        self._config = config
        self._latest_dir = self._config.get('path', 'LatestDirectory')
        self._working_dir = self._config.get('path', 'WorkingDirectory')
        self._historical_dir = self._config.get('path', 'HistoricalDirectory')
        self._subreddits = self.load_subreddits()
        self._stopwords = self.load_stopwords()
        self._banned_users = self.load_banned_users()
        self._cryptocurrencies = self.load_cryptocurrencies()
        self._historical = historical

        if self._historical is None:
            self.move_files()

        self.comments = None
        self.posts = None
        self.subreddit = None

        self.bigram_freq_df = None
        self.word_freq_df = None

    def load_subreddits(self):
        log("loading subreddits")
        return pd.DataFrame.from_records(data=self._db.get_subreddits())

    def load_stopwords(self):
        log("loading stopwords")
        return pd.DataFrame.from_records(data=self._db.get_stopwords())

    def load_cryptocurrencies(self):
        log("loading list of cryptocurrencies")
        return pd.DataFrame.from_records(data=self._db.get_cryptocurrencies())

    def load_banned_users(self):
        log("loading banned users")
        return self._db.get_banned_users()

    def move_files(self):
        log("moving files to working directory")
        # move to working dir
        copy_tree(self._latest_dir, self._working_dir)
        # delete latest dir
        shutil.rmtree(self._latest_dir)
        # Recreate empty latest dir
        if not os.path.exists(self._latest_dir):
            os.makedirs(self._latest_dir)

    def load_datasets(self, subreddit):
        log("Loading datasets for {0}".format(subreddit))

        if self._historical:
            directory = self._historical_dir
        else:
            directory = self._working_dir

        comments_path = "{0}comments_{1}.csv".format(directory, subreddit)
        posts_path = "{0}posts_{1}.csv".format(directory, subreddit)

        # if comments file exists load it
        if Path(comments_path).is_file():
            self.comments = pd.read_csv(comments_path)
        # else create empty dataframe
        else:
            self.comments = pd.DataFrame(
                columns=['Author', 'Text', 'Date', 'Score'])

        if Path(posts_path).is_file():
            self.posts = pd.read_csv(posts_path)
        # else create empty dataframe
        else:
            self.posts = pd.DataFrame(
                columns=['Author', 'Text', 'Date', 'Score'])

        # Remove comments and posts files
        try:
            os.remove(comments_path)
            os.remove(posts_path)
        except OSError as ose:
            log(ose)
            pass

        if self.posts.size < 1 and self.comments.size < 1:
            log("datasets not large enough")
            return False
        else:
            log("datasets loaded")
            # If datasets are large enough, check if document already exist for
            # subreddit, if not, one will be created
            self._db.subreddit_exist(subreddit)
            self.subreddit = subreddit
            return True

    def cleanse_datasets(self):
        log("Cleansing datasets")
        cleanse = Cleanse(self.comments, self.posts, self._stopwords,
                          self._banned_users)
        self.comments, self.posts = cleanse.get_data()

    def comments_and_posts(self):
        # Number of comments and posts on a subreddit
        com_post = CommentsPosts(self.comments, self.posts)
        no_comments, no_posts = com_post.get_num_comments_posts()
        self._db.set_num_post_comments(self.subreddit, no_comments, no_posts)

        # Number of comments and posts per day
        sub_doc = self._db.get_documents("commentpostbd", self.subreddit)
        old_cpbd = None
        if sub_doc.count() > 0:
            old_cpbd = self._db.query_cpbd(self.subreddit)
        cpbd = com_post.get_comments_posts_by_day(old_cpbd)
        self._db.set_comments_posts_by_day(cpbd, self.subreddit)

        # Subreddit activity
        one_day_change, one_day_total = com_post.get_comments_posts_activity(1)
        seven_day_change, seven_day_total = com_post.get_comments_posts_activity(
            7)
        thirty_day_change, thirty_day_total = com_post.get_comments_posts_activity(
            30)
        self._db.set_comments_posts_activity(
            self.subreddit, one_day_total, one_day_change, seven_day_total,
            seven_day_change, thirty_day_total, thirty_day_change)

    def wordfreq(self):
        # Instantiate word freq class
        WF = WordFreq(self.comments, self.posts)
        # Retrieve documents with old word freq
        subreddit_doc = self._db.get_documents("subreddits", self.subreddit)
        wordfreqbd_doc = self._db.get_documents("wordfreqbd", self.subreddit)

        # check whether old data for word freq exists
        # in the doc, if so pass it to word freq class
        # where old and new data will be merged
        old_word_freq = None
        if "word_freq" in subreddit_doc[0]:
            old_word_freq = subreddit_doc[0]["word_freq"]
        word_freq = WF.get_word_freq(old_word_freq)
        self._db.set_word_freq(word_freq, self.subreddit)

        self.word_freq_df = WF.word_freq_df

        # Again, check whether old word freq by day data
        # exists in the doc, if so pass it to the method
        old_wfbd = None
        if wordfreqbd_doc.count() > 0:
            old_wfbd = self._db.query_wfbd(self.subreddit)
        wfbd = WF.get_word_freq_by_day(old_wfbd)
        self._db.set_word_freq_by_day(wfbd, self.subreddit)

    def bigramfreq(self):
        # Instantiate bigram freq class
        BF = BigramFreq(self.comments, self.posts)
        # Retrieve documents with old word freq
        subreddit_doc = self._db.get_documents("subreddits", self.subreddit)
        bigramfreqbd_doc = self._db.get_documents("bigramfreqbd",
                                                  self.subreddit)

        # check whether old data for word freq exists
        # in the doc, if so pass it to word freq class
        # where old and new data will be merged
        old_bigram_freq = None
        if "bigram_freq" in subreddit_doc[0]:
            old_bigram_freq = subreddit_doc[0]["bigram_freq"]
        bigram_freq = BF.get_bigram_freq(old_bigram_freq)
        self._db.set_bigram_freq(bigram_freq, self.subreddit)

        self.bigram_freq_df = BF.bigram_freq_df

        # Again, check whether old word freq by day data
        # exists in the doc, if so pass it to the method
        old_bfbd = None
        if bigramfreqbd_doc.count() > 0:
            old_bfbd = self._db.query_bfbd(self.subreddit)
        bfbd = BF.get_bigram_freq_by_day(old_bfbd)
        self._db.set_bigram_freq_by_day(bfbd, self.subreddit)

    def currency_mentions(self):
        # Instantiate currency mentions class
        CM = CurrencyMention(self.comments, self.posts, self.word_freq_df,
                             self.bigram_freq_df, self._cryptocurrencies)

        # Retrieve documents with old word freq
        subreddit_doc = self._db.get_documents("subreddits", self.subreddit)
        currencymentionsbd_doc = self._db.get_documents(
            "currencymentionsbd", self.subreddit)

        old_currency_mentions = None
        if "currency_mentions" in subreddit_doc[0]:
            old_currency_mentions = subreddit_doc[0]["currency_mentions"]
        currency_mentions = CM.get_currency_mentions(old_currency_mentions)
        self._db.set_currency_mentions(currency_mentions, self.subreddit)

        old_cmbd = None
        if currencymentionsbd_doc.count() > 0:
            old_cmbd = self._db.query_cmbd(self.subreddit)
        cmbd = CM.currency_mentions_by_day(old_cmbd)
        self._db.set_currency_mentions_by_day(cmbd, self.subreddit)
