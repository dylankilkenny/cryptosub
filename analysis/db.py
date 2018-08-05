from pymongo import MongoClient
from logger import log

class MongoDB:

    def __init__(self, mongo_url):
        self._client = MongoClient(mongo_url)
        self._db = self._client.dev
        self._doc_limit = 500
    
    def subreddit_exist(self, subreddit):
        # Check if currency exists in collection
        if self._db.subreddits.find({'id': subreddit}).count() < 1:
            self._db.subreddits.insert({"id": subreddit})
    
    def get_subreddits(self):
        Subreddits = self._db.misc.find({},{"subs": 1})
        return Subreddits[0]["subs"]
    
    def get_cryptocurrencies(self):
        crypto = self._db.misc.find({},{"cryptocurrencies": 1})
        return crypto[0]["cryptocurrencies"]
    
    def get_banned_users(self):
        banned = self._db.misc.find({},{"banned_users": 1})
        return banned[0]["banned_users"]
    
    def get_stopwords(self):
        stopwords = self._db.misc.find({},{"stopwords": 1})
        return stopwords[0]["stopwords"]
    
    def get_documents(self, collection, subreddit):
        cursor = self._db[collection].find(
            {"id": subreddit}
        )
        return cursor
    
    def get_post_ids(self):
        PostIDs = self._db.misc.find({},{"PostIDs": 1})
        return PostIDs[0]["PostIDs"]
    
    def update_post_ids(self, PostID):
        self._db.misc.update_one({},{'$push': {'PostIDs': PostID}})
    
    def mark_subreddit_done(self, subreddit):
        subs = self._db.misc.find({},{'subs': 1})
        updated = subs[0]["subs"]
        
        for sub in updated:
            if sub["Subreddit"] == subreddit:
                sub["done"] = 1

        self._db.misc.update({},{"$unset":{"subs":""}})
        self._db.misc.update_one({},{"$set": {"subs": updated}})
    
    def reset_subreddit_done(self):
        subs = self._db.misc.find({},{'subs': 1})
        updated = subs[0]["subs"]
        
        for sub in updated:
            sub["done"] = 0

        self._db.misc.update({},{"$unset":{"subs":""}})
        self._db.misc.update_one({},{"$set": {"subs": updated}})
        
    
    def query_cpbd(self, subreddit):
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
    
    def query_wfbd(self, subreddit):
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
    
    def query_bfbd(self, subreddit):
        bfbd = self._db.bigramfreqbd.find(
            {
                "id": subreddit
            },
            {
                "bigram_freq_by_day": 1
            }
        )
        bfbd_list = []
        for doc in bfbd:
            for obj in doc["bigram_freq_by_day"]:
                bfbd_list.append(obj)
        return bfbd_list
    
    def query_cmbd(self, subreddit):
        cmbd = self._db.currencymentionsbd.find(
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
    
    def set_num_post_comments(self, subreddit, no_comments, no_posts):
        # Get number of comments and posts from Reddit Analyser
        cursor = self.get_documents("subreddits", subreddit)

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
    
    def set_comments_posts_by_day(self, cpbd, subreddit):
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
        
        log("Number of comments and posts by day: updated.")

    

    def set_comments_posts_activity(self, subreddit, one_day_total, one_day_change, seven_day_total, seven_day_change, thirty_day_total, thirty_day_change):
        cursor = self.get_documents("subreddits", subreddit)

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
        
    def set_word_freq(self, wordfreq, subreddit):
         # Get number of comments and posts from Reddit Analyser
        cursor = self.get_documents("subreddits", subreddit)

        for doc in cursor:
            if "word_freq" in doc:
                # Remove old data
                self._db.subreddits.update(
                    {"id": subreddit},
                    { "$unset": { "word_freq": ""} }
                )

        update = self._db.subreddits.update_one(
            {"id": subreddit},
            {
                "$push": {
                    "word_freq": {
                        "$each": wordfreq,
                        "$sort": { "n": -1 },
                        "$slice": 500
                    }
                }
            }
        )
        if update.modified_count > 0:
            log("Bigram frequency: updated.")
        else:
            log("Bigram frequency: modified count 0.")

    def set_word_freq_by_day(self, wfbd, subreddit):
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
        log("Word frequency by day: updated.")
        
    
    def set_bigram_freq(self, bigramfreq, subreddit):
         # Get number of comments and posts from Reddit Analyser
        cursor = self.get_documents("subreddits", subreddit)

        for doc in cursor:
            if "bigram_freq" in doc:
                # Remove old data
                self._db.subreddits.update(
                    {"id": subreddit},
                    { "$unset": { "bigram_freq": ""} }
                )

        update = self._db.subreddits.update_one(
            {"id": subreddit},
            {
                "$push": {
                    "bigram_freq": {
                        "$each": bigramfreq,
                        "$sort": { "n": -1 },
                        "$slice": 500
                    }
                }
            }
        )
        if update.modified_count > 0:
            log("Bigram frequency: updated.")
        else:
            log("Bigram frequency: modified count 0.")
    
    def set_bigram_freq_by_day(self, bfbd, subreddit):
        doc_list = [bfbd[i:i + self._doc_limit] for i in range(0, len(bfbd), self._doc_limit)]
        # Remove old data
        self._db.bigramfreqbd.remove(
            {"id": subreddit}
        )
        
        for doc in doc_list:
            self._db.bigramfreqbd.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : self._doc_limit}
                },
                {
                    "$set": {
                        "bigram_freq_by_day": doc
                    }, 
                    "$inc": { 
                        "count": len(doc)
                    }
                },upsert=True
            )

        log("Bigram frequency by day: updated.")
    
    def set_currency_mentions(self, cm, subreddit):
         # Get number of comments and posts from Reddit Analyser
        cursor = self.get_documents("subreddits", subreddit)

        for doc in cursor:
            if "currency_mentions" in doc:
                # Remove old data
                self._db.subreddits.update(
                    {"id": subreddit},
                    { "$unset": { "currency_mentions": ""} }
                )

        update = self._db.subreddits.update_one(
                {"id": subreddit},
                {"$set": {"currency_mentions": cm}}
                )
        if update.modified_count > 0:
            log("Currency Mentions: updated.")
        else:
            log("Currency Mentions: modified count 0.")
    
    def set_currency_mentions_by_day(self, cmbd, subreddit):
        # return if no mentions
        if cmbd == None:
            return

        doc_list = [cmbd[i:i + self._doc_limit] for i in range(0, len(cmbd), self._doc_limit)]
        # Remove old data
        self._db.currencymentionsbd.remove(
            {"id": subreddit}
        )
        
        for doc in doc_list:
            self._db.currencymentionsbd.update_one(
                {
                    "id": subreddit, 
                    "count": { "$lt" : self._doc_limit}
                },
                {
                    "$set": {
                        "currency_mentions_by_day": doc
                    }, 
                    "$inc": { 
                        "count": len(doc)
                    }
                },upsert=True
            )

        log("currency mentions by day: updated.")
    