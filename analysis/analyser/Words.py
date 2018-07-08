import pandas as pd
import json
from datetime import datetime, timedelta

class Words(object):
    """
    Handles stats such as the number of comments and posts
    happening on a subreddit each day, as well as the 
    activity (comments+posts) occuring over a given period.
    """

    def __init__(self, comments, posts):
        # disable SettingWithCopyWarning
        # https://stackoverflow.com/a/20627316/4254021
        # pd.options.mode.chained_assignment = None
        self.comments = comments
        self.posts = posts
    
    def WordCount(self, oldwc):
        wcc = self.comments.copy()
        wcc = list(collections.Counter(" ".join(wcc['Text']).split()).items())
        wcc = pd.DataFrame(wcc, columns=['word', 'n_comment'])

        wcp = self.posts.copy()
        wcp = list(collections.Counter(" ".join(wcp['Text']).split()).items())
        wcp = pd.DataFrame(wcp, columns=['word', 'n_post'])

        wc = pd.merge(wcc, wcp, on='word', how='outer')
        wc.fillna(0, inplace=True)
        wc['n'] = wc['n_comment'] + wc['n_post']      
        self.word_count = wc
        wc = wc.sort_values('n', ascending=False).head(500)                
        if oldwc != None:
            oldwc = pd.DataFrame.from_records(data=oldwc)
            oldnew_merged = pd.concat([wc,oldwc])
            oldnew_merged = oldnew_merged.groupby('word').sum().reset_index()
            oldnew_merged = oldnew_merged.to_json(orient='records', date_format=None)
            oldnew_merged= json.loads(oldnew_merged)
            return oldnew_merged
        wc = wc.to_json(orient='records', date_format=None)
        return json.loads(wc)
    
    def WordCountByDay(self, oldwordcount):
        # Copy posts and comments
        comments_copy = self.comments.copy()
        posts_copy = self.posts.copy()

        # Change date format from timestamp
        comments_copy["Date"] = pd.to_datetime(comments_copy['Date'], errors='coerce')
        posts_copy["Date"] = pd.to_datetime(posts_copy['Date'], errors='coerce')
        # Convert back to string date without hours
        comments_copy["Date"] = comments_copy["Date"].dt.strftime('%Y-%m-%d')
        posts_copy["Date"] = posts_copy["Date"].dt.strftime('%Y-%m-%d')
        # Merge both datasets
        merged = pd.concat([comments_copy,posts_copy])
        # Group by date
        merged = merged.groupby('Date')

        # Loop through dataframe counting most common 25 words for each date
        wcbd= []
    
        for name, group in merged:
            texts = " ".join(group['Text'])
            groupCounts = Counter(texts.split()).most_common(25)
            wcbd.append([name, dict(groupCounts)])

        # Create dataframe with counts
        wcbd = pd.DataFrame(wcbd, columns = ['Date','counts'])


        if oldwordcount != None:
            oldwordcount = pd.DataFrame.from_records(data=oldwordcount)
            oldnew_merged = pd.concat([wcbd,oldwordcount])
            oldnew_merged = oldnew_merged.groupby('Date')
            flattened = []
            # loop through groups
            for name, group in oldnew_merged:
                for obj in list(group["counts"]):
                    for item in obj.items():
                        flattened.append([name, item[0], item[1]])

            # Goal is to group similar dates and marge words together 
            # keeping the 25 most popular for each date
            flattened = pd.DataFrame(flattened, columns = ['Date','words','n'])
            
            flattened = flattened.groupby(['Date', 'words'])['n'].sum().reset_index()
            flattened = flattened.sort_values('n', ascending=False).groupby('Date')
            flattened = flattened.head(25)
            transformed = []
            # loop through groups
            for name, group in flattened.groupby('Date'):
                group_dict = dict(zip(group.words, group.n))
                transformed.append([name, group_dict])
            
            transformed = pd.DataFrame(transformed, columns = ['Date','counts'])
            transformed = transformed.to_json(orient='records', date_format=None)
            transformed= json.loads(transformed)
            return transformed
        
        wcbd = wcbd.to_json(orient='records', date_format=None)
        wcbd = json.loads(wcbd)
            
        return wcbd