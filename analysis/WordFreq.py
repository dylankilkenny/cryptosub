import pandas as pd
import json
from collections import Counter


class WordFreq(object):
    """
    Calculates the frequency a word occurs within a given subreddit. 
    WordFreq() deals with all time word freq, WordFreqByDay() gets top
    25 words used within a given day.
    """

    def __init__(self, comments, posts):
        # disable SettingWithCopyWarning
        # https://stackoverflow.com/a/20627316/4254021
        # pd.options.mode.chained_assignment = None
        self.comments = comments
        self.posts = posts
        self.word_freq = None
    
    def getWordFreq(self, old_word_freq):
        # Copy of dataframes
        comments_copy = self.comments.copy()
        posts_copy = self.posts.copy()
        # Count word freq, create dataframes and merge both dataframes
        comments_count = list(Counter(" ".join(comments_copy['Text']).split()).items())
        posts_count = list(Counter(" ".join(posts_copy['Text']).split()).items())
        com_df = pd.DataFrame(comments_count, columns=['word', 'n_comment'])
        post_df = pd.DataFrame(posts_count, columns=['word', 'n_post'])
        word_freq_df = pd.merge(com_df, post_df, on='word', how='outer')
        word_freq_df.fillna(0, inplace=True) # Remove NA
        # create n column with total count from post and comments
        word_freq_df['n'] = word_freq_df['n_comment'] + word_freq_df['n_post'] 

        self.word_count = word_freq_df
        # limit to 500 words
        word_freq_df = word_freq_df.sort_values('n', ascending=False).head(500)

        # If old word count in database, merge new with old and return 
        # the updated counts
        if old_word_freq != None:
            old_word_freq = pd.DataFrame.from_records(data=old_word_freq)
            oldnew_merged = pd.concat([word_freq_df,old_word_freq])
            # Updated counts
            word_freq_df = oldnew_merged.groupby('word').sum().reset_index()

        word_freq_df = word_freq_df.to_json(orient='records', date_format=None)
        return json.loads(word_freq_df)
    

    def getWordFreqByDay(self, oldwordcount = None):
        # Copy of dataframes
        comments_copy = self.comments.copy()
        posts_copy = self.posts.copy()

        # Change date format from timestamp to datetime
        comments_copy["Date"] = pd.to_datetime(comments_copy['Date'], errors='coerce')
        posts_copy["Date"] = pd.to_datetime(posts_copy['Date'], errors='coerce')
        # Convert back to string date without hours
        comments_copy["Date"] = comments_copy["Date"].dt.strftime('%Y-%m-%d')
        posts_copy["Date"] = posts_copy["Date"].dt.strftime('%Y-%m-%d')
        # Merge both datasets
        merged = pd.concat([comments_copy,posts_copy])
        # Group by date
        merged = merged.groupby('Date')

        wfbd_arr = []        
        # Loop through dataframe counting most common 25 words for each date
        for name, group in merged:
            texts = " ".join(group['Text'])
            group_counts = Counter(texts.split()).most_common(25)
            group_arr = []
            for key, value in dict(group_counts).items():
                group_arr.append({
                    "word": key,
                    "n": value
                })
            wfbd_arr.append([name, group_arr])

        # Create dataframe with counts
        wcbd = pd.DataFrame(wfbd_arr, columns = ['Date','counts'])


        if oldwordcount != None:
            oldwordcount = pd.DataFrame.from_records(data=oldwordcount)
            oldnew_merged = pd.concat([wcbd,oldwordcount])

            flattened = []
            # loop through dataframe, grouped by date, creating 
            # a new flattened df with one row, per date and word. Then group by
            # date and word, sum each instance to remove duplicates.
            for date, group in oldnew_merged.groupby('Date'):
                for array in group["counts"]:
                    for obj in array:
                        flattened.append([date, obj["word"], obj["n"]])
            flattened = pd.DataFrame(flattened, columns = ['Date','word','n'])
            flattened = flattened.groupby(['Date', 'word'])['n'].sum().reset_index()

            flat = []
            # Current flattened dataframe has one row per date and word, 
            # and optimally we dont want duplicate dates. The following
            # for loop transforms the df back to each date having an array 
            # of objects.
            for date, group in flattened.groupby('Date'):
                word = list(group["word"])
                n = list(group["n"])
                group_arr = []
                for i in range(len(n)-1):
                    group_arr.append({
                        "word":word[i],
                        "n":n[i]
                    })
                flat.append([date, group_arr])
                group_arr = []
            
            wcbd = pd.DataFrame(flat, columns = ['Date','counts'])
        
        wcbd = wcbd.to_json(orient='records', date_format=None)
        wcbd = json.loads(wcbd)
            
        return wcbd