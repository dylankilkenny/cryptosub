from logger import log
import time
import praw
from prawcore.exceptions import PrawcoreException
import pandas as pd
import requests
import json
import sys
import datetime
from pathlib import Path
import csv
from os import listdir

import praw
from configparser import ConfigParser

from db import MongoDB as db
from logger import log
from analysismanager import AnalysisManager

parser = ConfigParser()
parser.read('config.conf')


class Pushshift:
    def __init__(self, before_date, after_date, subreddit):
        self._before_date = before_date
        self._after_date = after_date
        self._subreddit = subreddit

        self._post_ids = []
        self.get_ids()

    def get_ids(self):
        data = self.query_pushshift()
        while len(data) > 0:
            for submission in data:
                self._post_ids.append(submission["id"])
            self._after_date = data[-1]['created_utc']
            data = self.query_pushshift()
            time.sleep(1)

    def query_pushshift(self):
        try:
            url = 'https://api.pushshift.io/reddit/search/submission?&size=1000&after={0}&before={1}&subreddit={2}'.format(
                self._after_date, self._before_date, self._subreddit)
            r = requests.get(url)
            data = json.loads(r.text)
            return data['data']
        except json.decoder.JSONDecodeError:
            log('Decoding JSON has failed')
            print(r.text)


class Reddit:
    def __init__(self, db, subreddit, post_ids):
        self._db = db
        self._subreddit = subreddit
        self._post_ids = post_ids
        self._praw = self.init_praw()
        self._comments_path = parser.get(
            'path', 'HistoricalDirectory') + '/comments_' + subreddit + '.csv'
        self._posts_path = parser.get(
            'path', 'HistoricalDirectory') + '/posts_' + subreddit + '.csv'
        self._comment_count = 0
        self._post_count = 0

    def init_praw(self):
        # init Reddit instance
        p = praw.Reddit(
            client_id=parser.get('reddit', 'client_id'),
            client_secret=parser.get('reddit', 'client_secret'),
            password=parser.get('reddit', 'password'),
            user_agent=parser.get('reddit', 'user_agent'),
            username=parser.get('reddit', 'username'))
        return p

    def save_post(self, post):
        posts_file = Path(self._posts_path)
        file_exists = posts_file.is_file()
        f = open(self._posts_path, 'a')
        try:
            writer = csv.writer(f)
            if file_exists is False:
                writer.writerow(
                    ["ID", "Text", "Date", "Score", "No. Comments", "Author"])
            writer.writerow(post)
        finally:
            f.close()

    def save_comment(self, comment):
        comments_file = Path(self._comments_path)
        file_exists = comments_file.is_file()
        f = open(self._comments_path, 'a')
        try:
            writer = csv.writer(f)
            if file_exists is False:
                writer.writerow(
                    ["ID", "PostID", "Text", "Date", "Score", "Author"])
            writer.writerow(comment)
        finally:
            f.close()

    def gather(self):
        # Loop through post IDs acquired from
        # shapeshift api
        while True:
            try:
                for ID in self._post_ids:
                    # Load all processed IDs from db
                    processed = self._db.get_post_ids()
                    # Check if post is already processed
                    if ID not in processed:
                        # Get reddit post
                        submission = self._praw.submission(id=ID)
                        # Save to csv
                        self.save_post([
                            submission.id, submission.title,
                            submission.created_utc, submission.score,
                            submission.num_comments, submission.author
                        ])
                        self._post_count += 1
                        # Add new post ID to database to prevent processing it again
                        self._db.update_post_ids(submission.id)
                        # Log details
                        self.logger(submission.created_utc)

                        #If post does not have any comments continue
                        if submission.num_comments < 1:
                            continue

                        #If comments have alot of nested replies this will load them also
                        submission.comments.replace_more(limit=0)
                        #Add comments to list
                        for comment in submission.comments.list():
                            self.save_comment([
                                comment.id, submission.id, comment.body,
                                comment.created_utc, comment.score,
                                comment.author
                            ])
                            self._comment_count += 1
                            # log details
                            self.logger(submission.created_utc)
                break
            except Exception as e:
                log(e, newline=True)

        log("*" * 30, newline=True)

    #Display mining information to the terminal
    def logger(self, date):
        date = datetime.datetime.fromtimestamp(date).strftime(
            '%Y-%m-%d %H:%M:%S')
        log("({0}) Posts:{1} - Comments:{2} - Last:{3}".format(
            self._subreddit, self._post_count, self._comment_count, date),
            returnline=True)


if __name__ == "__main__":
    log("Historical data collector started!")
    # Connect to DB
    db = db("mongodb://localhost:27017/")

    am = AnalysisManager(db, parser, historical=True)

    for i, row in am._subreddits.iterrows():
        if row["done"] == 1:
            log("%s already processed, skipping!" % row["Subreddit"])
            continue
        subreddit = row["Subreddit"]
        log("Gathering post ID's")
        pushshift = Pushshift(sys.argv[1], sys.argv[2], subreddit)
        post_ids = pushshift._post_ids
        reddit = Reddit(db, subreddit, post_ids)
        log("Gathering datasets")
        reddit.gather()

        # Get a List of files in working directory
        all_datasets = listdir(am._historical_dir)
        dataset_names = [
            "comments_{}.csv".format(subreddit),
            "posts_{}.csv".format(subreddit)
        ]
        if any(dataset in all_datasets for dataset in dataset_names):
            log("Processing: " + subreddit)
            loaded = am.load_datasets(subreddit)
            if loaded:
                am.cleanse_datasets()
                am.comments_and_posts()
                am.wordfreq()
                am.bigramfreq()
                am.currency_mentions()
                log("*" * 30)

            db.mark_subreddit_done(subreddit)

    db.reset_subreddit_done()
