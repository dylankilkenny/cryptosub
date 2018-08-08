import sys
from configparser import ConfigParser
from os import listdir

from db import MongoDB as db
from logger import log
from analysismanager import AnalysisManager

if __name__ == "__main__":

    # Connect to DB
    db = db("mongodb://localhost:27017/")

    config = ConfigParser()
    if len(sys.argv) > 1:
        config.read(sys.argv[1])
    else:
        config.read('config.conf')

    am = AnalysisManager(db, config)

    for i, row in am._subreddits.iterrows():
        # Get a List of files in working directory
        subreddit = row["Subreddit"]
        all_datasets = listdir(am._working_dir)
        dataset_names = [
            "comments_{}.csv".format(subreddit),
            "posts_{}.csv".format(subreddit)
        ]
        if any(dataset in all_datasets for dataset in dataset_names):
            log("Processing: " + subreddit + " | Files remaining: " +
                str(len(all_datasets)))
            loaded = am.load_datasets(subreddit)
            if loaded:
                am.cleanse_datasets()
                am.comments_and_posts()
                am.wordfreq()
                am.bigramfreq()
                am.currency_mentions()
                log("*" * 30)
