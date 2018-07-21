import pandas as pd
import json
from collections import Counter
import nltk 

class BigramFreq(object):
    """
    Calculates the frequency a word occurs within a given subreddit. 
    WordFreq() deals with all time word freq, WordFreqByDay() gets top
    25 words used within a given day.
    """

    def __init__(self, comments, posts):
        # disable SettingWithCopyWarning
        # https://stackoverflow.com/a/20627316/4254021
        pd.options.mode.chained_assignment = None

        self.comments = comments
        self.posts = posts
        self.bigram_freq_df = None
    
    def get_bigram_freq(self, old_bigrams):
        """
        Creating a list of bigram frequencies from the gathered 
        reddit comments and posts
        """
        # Copy of dataframes        
        comments = self.comments.copy()
        posts = self.posts.copy()
        
        # Respective counters
        comment_counts = Counter()
        post_counts = Counter()
        
        # Loop through both dataframes, finding the most frequent bigrams
        for sent in comments["Text"]:
            words = nltk.word_tokenize(sent)
            comment_counts.update(nltk.bigrams(words))
        bc = pd.DataFrame(list(comment_counts.items()), columns=['bigram', 'n_comment'])

        for sent in posts["Text"]:
            words = nltk.word_tokenize(sent)
            post_counts.update(nltk.bigrams(words))
        bp = pd.DataFrame(list(post_counts.items()), columns=['bigram', 'n_post'])

        # Merge both dataframes and join both words to create bigram
        bigram = pd.merge(bc, bp, on='bigram', how='outer')
        bigram.fillna(0, inplace=True)        
        bigram['n'] = bigram['n_comment'] + bigram['n_post']
        bigram["bigram"] = bigram["bigram"].apply(lambda x: ' '.join(x))

        self.bigram_freq_df = bigram
        # sort and limit to 500 bigrams
        bigram = bigram.sort_values('n', ascending=False).head(500)
        # If old bigram count in database, merge new with old and return 
        # the updated counts       
        if old_bigrams != None:
            old_bigrams = pd.DataFrame.from_records(data=old_bigrams)
            oldnew_merged = pd.concat([bigram,old_bigrams], sort=True)
            # updated counts
            bigram = oldnew_merged.groupby('bigram').sum().reset_index()

        bigram = bigram.to_json(orient='records', date_format=None)
        return json.loads(bigram)
    

    def get_bigram_freq_by_day(self, oldbigrams):
        # copy dataframes
        comments = self.comments.copy()
        posts = self.posts.copy()
        # Change date format from timestamp
        comments["Date"] = pd.to_datetime(comments['Date'], errors='coerce')
        posts["Date"] = pd.to_datetime(posts['Date'], errors='coerce')
        # Convert back to string date without hours
        comments["Date"] = comments["Date"].dt.strftime('%Y-%m-%d')
        posts["Date"] = posts["Date"].dt.strftime('%Y-%m-%d')
        #Merge dataframes
        merged = pd.concat([posts,comments], sort=True)   
        # Group by date
        merged = merged.groupby('Date')
        bbd_list = []
        # loop through groups
        for name, group in merged:
            merged_counts = Counter()
            # Loop through text counting bigrams
            for sent in group["Text"]:
                words = nltk.word_tokenize(sent)
                merged_counts.update(nltk.bigrams(words))
            updated = []
            # join bigrams to one word
            for key, value in merged_counts.most_common(25):
                k = ' '.join(key)
                updated.append({
                    "bigram": k,
                    "n": value
                })
            # append grouped date and counted bigrams to list
            bbd_list.append([name, updated])

        # Create dataframe with counts
        bbd = pd.DataFrame(bbd_list, columns = ['Date','counts'])
        
        if oldbigrams != None:
            oldbigrams = pd.DataFrame.from_records(data=oldbigrams)
            oldnew_merged = pd.concat([bbd,oldbigrams], sort=True)

            flattened = []
            # loop through groups
            for date, group in oldnew_merged.groupby('Date'):
                for array in group["counts"]:
                    for obj in array:
                        flattened.append([date, obj["bigram"], obj["n"]])

            # Goal is to group similar dates and marge words together 
            # keeping the 25 most popular for each date
            flattened = pd.DataFrame(flattened, columns = ['Date','bigram','n'])            
            flattened = flattened.groupby(['Date', 'bigram'])['n'].sum().reset_index()
            
            flat = []
            for date, group in flattened.groupby('Date'):
                bigram = list(group["bigram"])
                n = list(group["n"])
                group_arr = []
                for i in range(len(n)-1):
                    if i > 25: 
                        break
                    group_arr.append({
                        "bigram":bigram[i],
                        "n":n[i]
                    })
                flat.append([date, group_arr])
                group_arr = []

            bbd = pd.DataFrame(flat, columns = ['Date','counts'])
       
        bbd = bbd.to_json(orient='records', date_format=None)
        bbd = json.loads(bbd)
        return bbd