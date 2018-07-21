from pymongo import MongoClient
from logger import log

class MongoDB:

    def __init__(self, mongo_url):
        self._client = MongoClient(mongo_url)
        self._db = self._client.dev
        self._doc_limit = 500
    
    def SubredditExist(self, subreddit):
        # Check if currency exists in collection
        if self._db.subreddits.find({'id': subreddit}).count() < 1:
            self._db.subreddits.insert({"id": subreddit})
    
    def getSubreddits(self):
        Subreddits = self._db.misc.find({},{"subs": 1})
        return Subreddits[0]["subs"]
    
    def getCryptocurrencies(self):
        crypto = self._db.misc.find({},{"cryptocurrencies": 1})
        return crypto[0]["cryptocurrencies"]
    
    def getBannedUsers(self):
        banned = self._db.misc.find({},{"banned_users": 1})
        return banned[0]["banned_users"]
    
    def getStopwords(self):
        stopwords = self._db.misc.find({},{"stopwords": 1})
        return stopwords[0]["stopwords"]
    
    def getDocuments(self, collection, subreddit):
        cursor = self._db[collection].find(
            {"id": subreddit}
        )
        return cursor
    
    def SetNumPostComments(self, subreddit, no_comments, no_posts):
        # Get number of comments and posts from Reddit Analyser
        cursor = self.getDocuments("subreddits", subreddit)

        if "no_comments" in cursor[0]:
            no_comments = no_comments + cursor[0]["no_comments"]
            no_posts = no_posts + cursor[0]["no_posts"]

        update = self._db.subreddits.update_one(
            {"id": subreddit},
            {
                "$set": {
                    "no_comments": no_comments,
                    "no_posts": no_posts 
                }
            }
        )
        if update.modified_count > 0:
            log("Number of comments and posts: updated.")
        else:
            log("Number of comments and posts: modified count 0.")
    
    def queryCPBD(self, subreddit):
        cpbd = self._db.commentpostbd.find(
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
    
    def queryWFBD(self, subreddit):
        wfbd = self._db.wordfreqbd.find(
            {
                "id": subreddit
            },
            {
                "word_freq_by_day": 1
            }
        )
        wfbd_list = []
        for doc in wfbd:
            for obj in doc["word_freq_by_day"]:
                wfbd_list.append(obj)
        return wfbd_list
    
    def setCommentsPostsByDay(self, cpbd, subreddit):
        array_list = [cpbd[i:i + self._doc_limit] for i in range(0, len(cpbd), self._doc_limit)]
        # Remove old data
        self._db.commentpostbd.remove(
            {"id": subreddit}
        )
        for arr in array_list:
            update = self._db.commentpostbd.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : self._doc_limit}
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
        
        if update.modified_count > 0:
            log("Number of comments and posts by day: updated.")
        else:
            log("Number of comments and posts by day: modified count 0.")
    

    def SetCommentsPostsActivity(self, subreddit, one_day_total, one_day_change, seven_day_total, seven_day_change, thirty_day_total, thirty_day_change):
        cursor = self.getDocuments("subreddits", subreddit)

        if "one_day_total" in cursor[0]:
            # Remove old data
            self._db.subreddits.update(
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
        update = self._db.subreddits.update_one(
            {"id": subreddit},
            {
                "$set": {
                    "one_day_total": int(one_day_total),
                    "one_day_change": int(one_day_change),
                    "seven_day_total": int(seven_day_total),
                    "seven_day_change": int(seven_day_change),
                    "thirty_day_total": int(thirty_day_total), 
                    "thirty_day_change": int(thirty_day_change)
                }
            }
        )

        if update.modified_count > 0:
            log("comments and posts activity: updated.")
        else:
            log("comments and posts activity: modified count 0.")
        
    def SetWordFreq(self, wordfreq, subreddit):
         # Get number of comments and posts from Reddit Analyser
        cursor = self.getDocuments("subreddits", subreddit)

        for doc in cursor:
            if "word_count" in doc:
                # Remove old data
                self._db.subreddits.update(
                    {"id": subreddit},
                    { "$unset": { "word_count": ""} }
                )

        update = self._db.subreddits.update_one(
            {"id": subreddit},
            {
                "$push": {
                    "word_count": {
                        "$each": wordfreq,
                        "$sort": { "n": -1 },
                        "$slice": 500
                    }
                }
            }
        )
        if update.modified_count > 0:
            log("Number of comments and posts: updated.")
        else:
            log("Number of comments and posts: modified count 0.")

    def setWordFreqByDay(self, wfbd, subreddit):
        doc_list = [wfbd[i:i + self._doc_limit] for i in range(0, len(wfbd), self._doc_limit)]
        # Remove old data
        self._db.wordfreqbd.remove(
            {"id": subreddit}
        )
        
        for doc in doc_list:
            self._db.wordfreqbd.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : self._doc_limit}
                },
                {
                    "$set": {
                        "word_freq_by_day": doc
                    }, 
                    "$inc": { 
                        "count": len(doc)
                    }
                },upsert=True
            )