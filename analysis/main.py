#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Save reddit posts to db"""
from logger import log
import analyser
import pandas as pd
from pymongo import MongoClient
import time
import os
import datetime
from pathlib import Path
from bson import ObjectId
from configparser import ConfigParser
from distutils.dir_util import copy_tree
import os, shutil
from os import listdir
import sys

parser = ConfigParser()
if len(sys.argv) > 1:
    parser.read(sys.argv[1])
else:
    parser.read('config.conf')

def GetSubredditDocument(db, subreddit):
    cursor = db.subreddits.find(
        {"id": subreddit}
    )
    return cursor

def SetNoPostComments(RA, db, subreddit):
    # Get number of comments and posts from Reddit Analyser
    (nc, np) = RA.NoPostComments()
    cursor = GetSubredditDocument(db, subreddit)
    for doc in cursor:
        if "no_comments" in doc:
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$set": {
                        "no_comments": nc + doc["no_comments"],
                        "no_posts": np + doc["no_posts"]
                    }
                }
            )
        else:
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$set": {
                        "no_comments": nc,
                        "no_posts": np 
                    }
                }
            )

def SetNoPostCommentsTotals(RA, db, subreddit):
    # Get number of comments and posts from Reddit Analyser
    cpbd = QueryCPBD(db, subreddit)
    cursor = GetSubredditDocument(db, subreddit)
    
    one_day_change, one_day_total = RA.NoPostCommentsTotals(cpbd, 1)
    seven_day_change, seven_day_total = RA.NoPostCommentsTotals(cpbd, 7)
    thirty_day_change, thirty_day_total = RA.NoPostCommentsTotals(cpbd, 30)

    if "one_day_total" in cursor[0]:
        # Remove old data
        db.subreddits.update(
            {"id": subreddit},
            { 
                "$unset": { 
                    "one_day_total": "",
                    "one_day_change": "",
                    "seven_day_total": "",
                    "seven_day_change": "",
                    "thirty_day_total": "",
                    "thirty_day_change": ""
                }
            }
        )
        # Add stats to db
        db.subreddits.update_one(
            {"id": subreddit},
            {
                "$set": {
                    "one_day_total": one_day_total,
                    "one_day_change": one_day_change,
                    "seven_day_total": seven_day_total,
                    "seven_day_change": seven_day_change,
                    "thirty_day_total": thirty_day_total, 
                    "thirty_day_change": thirty_day_change
                }
            }
        )
            
def SetMostActiveUsers(RA, db, subreddit):
    
    cursor = GetSubredditDocument(db, subreddit)
    for doc in cursor:
        if "most_active_users" in doc:
            mau = RA.MostActiveUsers(doc["most_active_users"]) 
            # Remove old data
            db.subreddits.update(
                {"id": subreddit},
                { "$unset": { "most_active_users": ""} }
            )
            # Add new data
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$push": {
                        "most_active_users": {
                            "$each": mau,
                            "$sort": { "Activity": -1 },
                            "$slice": 1000
                        }
                    }
                }
            )
        else:
            mau = RA.MostActiveUsers(None)
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$push": {
                        "most_active_users": {
                            "$each": mau,
                            "$sort": { "Activity": -1 },
                            "$slice": 1000
                        }
                    }
                }
            )

def QueryCPBD(db, subreddit):
    cpbd = db.commentpostbd.find(
        {
            "id": subreddit
        },
        {
            "comments_posts_by_day": 1
        }
    )
    cpbd_list = []
    for doc in cpbd:
        for obj in doc["comments_posts_by_day"]:
            cpbd_list.append(obj)

    return cpbd_list


def SetCommentsPostsByDay(RA, db, subreddit):
    # Find all docs for subreddit 
    cursor = db.commentpostbd.find({"id": subreddit})
    # if more than 0
    if cursor.count() > 0:
        # Array limit per doc
        LIMIT = 500
        cpbd_prev = QueryCPBD(db, subreddit)                     
        cpbd = RA.CommentsPostsByDay(cpbd_prev)
        array_list = [cpbd[i:i + LIMIT] for i in range(0, len(cpbd), LIMIT)]
        # Remove old data
        db.commentpostbd.remove(
            {"id": subreddit}
        )
        for arr in array_list:
            db.commentpostbd.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : LIMIT}
                },
                {
                    "$set": {
                        "comments_posts_by_day": arr
                    }, 
                    "$inc": { 
                        "count": len(arr)
                    }
                },upsert=True
            )
    else:
        cpbd = RA.CommentsPostsByDay(None)
        db.commentpostbd.insert_one(
            {      
                "id": subreddit,
                "comments_posts_by_day": cpbd
            }
        )    

def SetOverallUserScoreTail(RA, db, subreddit):
    cursor = GetSubredditDocument(db, subreddit)
    for doc in cursor:
        if "overall_user_score_tail" in doc:
            ous = RA.OverallUserScoreTail(doc["overall_user_score_tail"])
            # Remove old data
            db.subreddits.update(
                {"id": subreddit},
                { "$unset": { "overall_user_score_tail": ""} }
            )
            # Add new data
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$set": {
                        "overall_user_score_tail": ous
                    }
                }
            )
        else:
            ous = RA.OverallUserScoreTail(None)
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$set": {
                        "overall_user_score_tail": ous
                    }
                }
            )

def SetOverallUserScoreHead(RA, db, subreddit):
    cursor = GetSubredditDocument(db, subreddit)
    for doc in cursor:
        if "overall_user_score_head" in doc:
            ous = RA.OverallUserScoreHead(doc["overall_user_score_head"])
            # Remove old data
            db.subreddits.update(
                {"id": subreddit},
                { "$unset": { "overall_user_score_head": ""} }
            )
            # Add new data
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$set": {
                        "overall_user_score_head": ous
                    }
                }
            )
        else:
            ous = RA.OverallUserScoreHead(None)
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$set": {
                        "overall_user_score_head": ous
                    }
                }
            )

def QuerySBD(db, subreddit):
    sbd = db.sentimentbd.find(
        {
            "id": subreddit
        },
        {
            "sentiment_by_day": 1
        }
    )
    sbd_list = []
    for doc in sbd:
        for obj in doc["sentiment_by_day"]:
            sbd_list.append(obj)

    return sbd_list

def SetSentimentByDay(RA, db, subreddit):
    # Find all docs for subreddit 
    cursor = db.sentimentbd.find({"id": subreddit})
    # if more than 0
    if cursor.count() > 0:
        # Array size limit per doc
        LIMIT = 500
        sbd_prev = QuerySBD(db, subreddit)                     
        sbd = RA.SentimentByDay(sbd_prev)
        array_list = [sbd[i:i + LIMIT] for i in range(0, len(sbd), LIMIT)]
        # Remove old data
        db.sentimentbd.remove(
            {"id": subreddit}
        )
        for arr in array_list:
            db.sentimentbd.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : LIMIT}
                },
                {
                    "$set": {
                        "sentiment_by_day": arr
                    }, 
                    "$inc": { 
                        "count": len(arr)
                    }
                },upsert=True
            )
    else:
        sbd = RA.SentimentByDay(None)
        db.sentimentbd.insert_one(
            {      
                "id": subreddit,
                "sentiment_by_day": sbd,
                "count":len(sbd)
            }
        )    

def SetWordCount(RA, db, subreddit):
    cursor = GetSubredditDocument(db, subreddit)
    for doc in cursor:
        if "word_count" in doc:
            wc = RA.WordCount(doc["word_count"])
            # Remove old data
            db.subreddits.update(
                {"id": subreddit},
                { "$unset": { "word_count": ""} }
            )
            # Add new data
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$push": {
                        "word_count": {
                            "$each": wc,
                            "$sort": { "n": -1 },
                            "$slice": 500
                        }
                    }
                }
            )
        else:
            wc = RA.WordCount(None)
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$push": {
                        "word_count": {
                            "$each": wc,
                            "$sort": { "n": -1 },
                            "$slice": 500
                        }
                    }
                }
            )

def QueryWCBD(db, subreddit):
    wcbd = db.wordcountbd.find(
        {
            "id": subreddit
        },
        {
            "wordcount_by_day": 1
        }
    )
    wcbd_list = []
    for doc in wcbd:
        for obj in doc["wordcount_by_day"]:
            wcbd_list.append(obj)
    return wcbd_list

def SetWordCountByDay(RA, db, subreddit):
     # Find all docs for subreddit 
    cursor = db.wordcountbd.find({"id": subreddit})
    # if more than 0
    if cursor.count() > 0:
        # Array limit per doc
        LIMIT = 500
        wcbd_prev = QueryWCBD(db, subreddit)                     
        wcbd = RA.WordCountByDay(wcbd_prev)
        array_list = [wcbd[i:i + LIMIT] for i in range(0, len(wcbd), LIMIT)]
        # Remove old data
        db.wordcountbd.remove(
            {"id": subreddit}
        )
        for arr in array_list:
            db.wordcountbd.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : LIMIT}
                },
                {
                    "$set": {
                        "wordcount_by_day": arr
                    }, 
                    "$inc": { 
                        "count": len(arr)
                    }
                },upsert=True
            )
    else:
        wcbd = RA.WordCountByDay(None)
        db.wordcountbd.insert_one(
            {      
                "id": subreddit,
                "wordcount_by_day": wcbd,
                "count":len(wcbd)
            }
        )     

def SetCurrencyMentions(RA, db, subreddit):
    # Find subreddit document
    cursor = db.subreddits.find({"id": subreddit})
    for doc in cursor:
        # If already exists
        if "currency_mentions" in doc:
            # call reddit analyser function with old data
            cm = RA.CurrencyMentions(doc["currency_mentions"])
            # Remove old data from document
            db.subreddits.update(
                {"id": subreddit},
                { "$unset": { "currency_mentions": ""}})
            # Add new merged data
            db.subreddits.update_one(
                {"id": subreddit},
                {"$set": {"currency_mentions": cm}})
        # else it does not exist
        else:
            # call reddit analyser function without old data
            cm = RA.CurrencyMentions(None)
            # update document with summarised data
            db.subreddits.update_one(
                {"id": subreddit},
                {"$set": {"currency_mentions": cm}})

def QueryCMBD(db, subreddit):
    cmbd = db.currencymentionsbd.find(
        {
            "id": subreddit
        },
        {
            "currency_mentions_by_day": 1
        }
    )
    cmbd_list = []
    for doc in cmbd:
        for obj in doc["currency_mentions_by_day"]:
            cmbd_list.append(obj)
    return cmbd_list

def SetCurrencyMentionsByDay(RA, db, subreddit):
    # Find all docs for subreddit 
    cursor = db.currencymentionsbd.find({"id": subreddit})
    LIMIT = 500    
    # if more than 0
    if cursor.count() > 0:
        # Array limit per doc
        cmbd_prev = QueryCMBD(db, subreddit)                     
        cmbd = RA.CurrencyMentionsByDay(cmbd_prev)
        # return if no mentions
        if cmbd == None:
            return
        array_list = [cmbd[i:i + LIMIT] for i in range(0, len(cmbd), LIMIT)]
        # Remove old data
        db.currencymentionsbd.remove(
            {"id": subreddit}
        )
        for arr in array_list:
            db.currencymentionsbd.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : LIMIT}
                },
                {
                    "$set": {
                        "currency_mentions_by_day": arr
                    }, 
                    "$inc": { 
                        "count": len(arr)
                    }
                },upsert=True
            )
    else:
        cmbd = RA.CurrencyMentionsByDay(None)
        # return if no mentions
        if cmbd == None:
            return
        array_list = [cmbd[i:i + LIMIT] for i in range(0, len(cmbd), LIMIT)]
        for arr in array_list:   
            db.currencymentionsbd.insert_one(
                {      
                    "id": subreddit,
                    "currency_mentions_by_day": arr,
                    "count":len(arr)
                }
            )  

def SetBigrams(RA, db, subreddit):
    cursor = GetSubredditDocument(db, subreddit)
    for doc in cursor:
        if "bigram_count" in doc:
            bc = RA.Bigram(doc["bigram_count"])
            # Remove old data
            db.subreddits.update(
                {"id": subreddit},
                { "$unset": { "bigram_count": ""} }
            )
            # Add new data
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$push": {
                        "bigram_count": {
                            "$each": bc,
                            "$sort": { "n": -1 },
                            "$slice": 500
                        }
                    }
                }
            )
        else:
            bc = RA.Bigram(None)
            db.subreddits.update_one(
                {"id": subreddit},
                {
                    "$push": {
                        "bigram_count": {
                            "$each": bc,
                            "$sort": { "n": -1 },
                            "$slice": 500
                        }
                    }
                }
            )

def QueryBBD(db, subreddit):
    bbd = db.bigramsbd.find(
        {
            "id": subreddit
        },
        {
            "bigram_by_day": 1
        }
    )
    bbd_list = []
    for doc in bbd:
        for obj in doc["bigram_by_day"]:
            bbd_list.append(obj)

    return bbd_list

def SetBigramsByDay(RA, db, subreddit):
    # Find all docs for subreddit 
    cursor = db.bigramsbd.find({"id": subreddit})
    LIMIT = 500
    # if more than 0
    if cursor.count() > 0:
        # Array limit per doc
        bbd_prev = QueryBBD(db, subreddit)                     
        bbd = RA.BigramByDay(bbd_prev)
        array_list = [bbd[i:i + LIMIT] for i in range(0, len(bbd), LIMIT)]
        # Remove old data
        db.bigramsbd.remove(
            {"id": subreddit}
        )
        for arr in array_list:
            db.bigramsbd.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : LIMIT}
                },
                {
                    "$set": {
                        "bigram_by_day": arr
                    }, 
                    "$inc": { 
                        "count": len(arr)
                    }
                },upsert=True
            )
    else:
        bbd = RA.BigramByDay(None)
        array_list = [bbd[i:i + LIMIT] for i in range(0, len(bbd), LIMIT)]
        for arr in array_list:
            bbdresult = db.bigramsbd.insert_one(
                        {      
                            "id": subreddit,
                            "bigram_by_day": bbd,
                            "count": len(bbd)
                        }
                    )

def QueryCBA(db, subreddit):
    cba = db.currencybyauthor.find(
        {
            "id": subreddit
        },
        {
            "currency_by_author": 1
        }
    )
    cba_list = []
    for doc in cba:
        for obj in doc["currency_by_author"]:
            cba_list.append(obj)
    return cba_list

def SetCurrencyByAuthor(RA, db, subreddit, symbol, currency):
    # Find all docs for subreddit 
    cursor = db.currencybyauthor.find({"id": subreddit})
    # if more than 0
    if cursor.count() > 0:
        # Array limit per doc
        LIMIT = 500
        cba_prev = QueryCBA(db, subreddit)                     
        cba = RA.CurrencyByAuthor(cba_prev)
        array_list = [cba[i:i + LIMIT] for i in range(0, len(cba), LIMIT)]
        # Remove old data
        db.currencybyauthor.remove(
            {"id": subreddit}
        )
        for arr in array_list:
            db.currencybyauthor.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : LIMIT}
                },
                {
                    "$set": {
                        "currency_by_author": arr,
                        "symbol": symbol,
                        "currency": currency
                    }, 
                    "$inc": { 
                        "count": len(arr)
                    }
                },upsert=True
            )
    else:
        cba = RA.CurrencyByAuthor(None)
        db.currencybyauthor.insert_one(
            {      
                "id": subreddit,
                "currency_by_author": cba,
                "count": len(cba)
            }
        )



def RemoveFiles():
    LATEST_PATH = parser.get('path', 'LatestDirectory')
    shutil.rmtree(LATEST_PATH)
    if not os.path.exists(LATEST_PATH):
        os.makedirs(LATEST_PATH)

if __name__ == '__main__':
    # Connect to DB
    client = MongoClient(parser.get('db', 'url'))
    db = client.dev

    # Load subreddit list
    subreddits = pd.read_csv(parser.get('path', 'subs'))
    # Copy files from latest to working directory
    copy_tree(parser.get('path', 'LatestDirectory'), parser.get('path', 'WorkingDirectory'))
    # Remove files from latest directory
    RemoveFiles()
    # Loop through subreddits
    for i, row in subreddits.iterrows():
        # Get a List of files in working directory
        SUBREDDIT = row["Subreddit"]
        FILES = listdir(parser.get('path', 'WorkingDirectory'))
        FILES_LENGTH = len(FILES)
        FILE_NAME = "comments_"+SUBREDDIT+".csv"

        if FILE_NAME in FILES and SUBREDDIT:
            comments_path = "{0}comments_{1}.csv".format(parser.get('path', 'WorkingDirectory'), SUBREDDIT)            
            posts_path = "{0}posts_{1}.csv".format(parser.get('path', 'WorkingDirectory'), SUBREDDIT)
            banned_path = parser.get('path', 'banned_users')
            stopwords = pd.read_csv(parser.get('path', 'stopwords'))            
            cryptocurrencies = pd.read_csv(parser.get('path', 'cryptocurrencies'))            
            log("Processing: "+ SUBREDDIT +" | Files remaining: " + str(FILES_LENGTH), returnline=True)

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
            try:
                os.remove(comments_path)
                os.remove(posts_path)
            except OSError:
                pass

            # if no comments and posts in dataframes return
            if posts.size < 1 and comments.size < 1:
                log("No comments or posts found, returning.", newline=True)
                continue

            # Check if currency exists in collection
            if db.subreddits.find({'id': SUBREDDIT}).count() < 1:
                db.subreddits.insert({"id": SUBREDDIT})

            log("Instantiating reddit analyser...", newline=True)
            RA = analyser.RedditAnalyser(comments, posts, cryptocurrencies, stopwords, banned_path)

            log("Counting bigrams...")
            SetBigrams(RA, db, SUBREDDIT)

            log("bigrams by day...")    
            SetBigramsByDay(RA, db, SUBREDDIT)

            log("Count number comments and posts...")    
            SetNoPostComments(RA, db, SUBREDDIT)

            log("Gathering most active users...")    
            SetMostActiveUsers(RA, db, SUBREDDIT)


            log("Gathering comments and posts per day...")    
            SetCommentsPostsByDay(RA, db, SUBREDDIT)

            
            log("Gathering overall user score head...")    
            SetOverallUserScoreHead(RA, db, SUBREDDIT)


            log("Gathering overall user score tail...")    
            SetOverallUserScoreTail(RA, db, SUBREDDIT)
            
            log("Calcuating sentiment by day...", "")    
            SetSentimentByDay(RA, db, SUBREDDIT)

            
            log("performing word count...")    
            SetWordCount(RA, db, SUBREDDIT)


            log("performing word count by day...")    
            SetWordCountByDay(RA, db, SUBREDDIT)

            
            log("Gathering currency mentions...")    
            SetCurrencyMentions(RA, db, SUBREDDIT)


            log("Currency mentions by day...")    
            SetCurrencyMentionsByDay(RA, db, SUBREDDIT)

            log("Comments posts by day totals...")    
            SetNoPostCommentsTotals(RA, db, SUBREDDIT)
