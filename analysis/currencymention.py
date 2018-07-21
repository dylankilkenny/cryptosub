import pandas as pd
import json
from datetime import datetime, timedelta
from collections import Counter
import collections
import nltk

class CurrencyMention(object):
    """
    Handles stats such as the number of comments and posts
    happening on a subreddit each day, as well as the 
    activity (comments+posts) occuring over a given period.
    """

    def __init__(self, comments, posts, word_freq_df, bigram_freq_df, currency_symbols):
        # disable SettingWithCopyWarning
        # https://stackoverflow.com/a/20627316/4254021
        # pd.options.mode.chained_assignment = None
        self.comments = comments
        self.posts = posts
        self.word_freq_df = word_freq_df
        self.bigram_freq_df = bigram_freq_df
        self.currency_symbols = currency_symbols
    
    def get_currency_mentions(self, oldcm):
        # Currency mentions single word
        word_freq = self.word_freq_df.copy()
        bigram_freq = self.bigram_freq_df.copy()
        cm = self.currency_symbols.copy()
        cm['Symbol'] = cm.Symbol.str.lower()
        cm['Name'] = cm.Name.str.lower()
        cm["Mentions_Sym"] = 0
        cm["Mentions_Name"] = 0

        for symbol in cm['Symbol']:
            c = word_freq.loc[word_freq['word'] == symbol, 'n'].values
            if len(c) > 0:
                cm.loc[cm['Symbol'] == symbol, 'Mentions_Sym'] = c[0]

        for name in cm['Name']:
            if len(name.split()) == 1:
                c = word_freq.loc[word_freq['word'] == name, 'n'].values
                if len(c) > 0:
                    cm.loc[cm['Name'] == name, 'Mentions_Name'] = c[0]
            else:
                c = bigram_freq.loc[bigram_freq['bigram'] == name, 'n'].values
                if len(c) > 0:
                    cm.loc[cm['Name'] == name, 'Mentions_Name'] = c[0]
        
        cm["n"] = cm["Mentions_Name"] + cm["Mentions_Sym"]

        if oldcm != None:
            oldcm = pd.DataFrame.from_records(data=oldcm)
            oldnew_merged = pd.concat([cm,oldcm])
            cm = oldnew_merged.groupby(["Name", "Currency", "Symbol"]).sum().reset_index()

        cm = cm.to_json(orient='records', date_format=None)
        return json.loads(cm)
    
    def currency_mentions_by_day(self, oldcmbd):
        #
        #
        # This function requires some refactoring,
        # it re-performs word and bigram counts on 
        # both datasets. It may be possible to just use
        # the word and bigram counts from the respective 
        # classes
        #
        #
        # copy both dataframes
        comments = self.comments.copy()
        posts = self.posts.copy()
        # Change date format from timestamp
        comments["Date"] = pd.to_datetime(comments['Date'], errors='coerce')
        posts["Date"] = pd.to_datetime(posts['Date'], errors='coerce')
        # Convert back to string date without hours
        comments["Date"] = comments["Date"].dt.strftime('%Y-%m-%d')
        posts["Date"] = posts["Date"].dt.strftime('%Y-%m-%d')
        merged = pd.concat([posts,comments])   
        # Group by date
        merged = merged.groupby('Date')
        bigram = []
        word_count = []        
        # loop through groups
        for name, group in merged:
            # word count
            texts = " ".join(group['Text'])
            word_count.append([name, dict(Counter(texts.split()))])
            ####
            # Bigrams
            merged_counts = collections.Counter()
            # Loop through text counting bigrams
            for sent in group["Text"]:
                words = nltk.word_tokenize(sent)
                merged_counts.update(nltk.bigrams(words))
            updated_full = {}
            # join full list of bigrams to one word
            for key, value in merged_counts.items():
                k = ' '.join(key)
                updated_full[k] = value
            # append grouped date and counted bigrams to list
            bigram.append([name, updated_full])

        # Create dataframe with counts
        bigram = pd.DataFrame(bigram, columns = ['Date','counts']).sort_values('Date', ascending=True)
        # Create dataframe with counts
        word_count = pd.DataFrame(word_count, columns = ['Date','counts']).sort_values('Date', ascending=True)

        # Create merged dataframe
        merged = {"Date": word_count["Date"], "word_count": word_count["counts"], "bigram_count": bigram["counts"]}
        merged = pd.DataFrame(data=merged)
        
        
        cm = self.currency_symbols.copy()
        cm['Symbol'] = cm.Symbol.str.lower()
        cm['Name'] = cm.Name.str.lower()
        cm = cm.drop('Currency', 1)
        cm["Mentions_Sym"] = 0
        cm["Mentions_Name"] = 0


        cmbd = [] 
        for date, group in merged.groupby('Date'):
            word_count = group["word_count"].tolist()
            bigram_count = group["bigram_count"].tolist()
            temp_cm = cm
            for symbol in temp_cm['Symbol']:
                if symbol in word_count[0]:
                    temp_cm.loc[temp_cm['Symbol'] == symbol, 'Mentions_Sym'] = word_count[0][symbol]
            for name in temp_cm['Name']:
                if len(name.split()) == 1:
                    if name in word_count[0]:
                        temp_cm.loc[temp_cm['Name'] == name, 'Mentions_Name'] = word_count[0][name]
                else:
                    if name in bigram_count[0]:
                        temp_cm.loc[temp_cm['Name'] == name, 'Mentions_Name'] = bigram_count[0][name]

            temp_cm["n"] = temp_cm["Mentions_Name"] + temp_cm["Mentions_Sym"]
            temp_cm = temp_cm.drop(['Mentions_Name','Mentions_Sym'], 1)
            temp_cm = temp_cm[temp_cm['n'] != 0]
            
            temp_cm = temp_cm.to_json(orient='records', date_format=None)
            temp_cm = json.loads(temp_cm)
            cmbd.append([date, temp_cm])
                
        
        cmbd = pd.DataFrame(cmbd, columns = ['Date','counts'])
        # removes rows where no counts have been found
        cmbd =  cmbd[cmbd['counts'].str.len() != 0]
        if len(cmbd) < 1:
                return None

        if oldcmbd != None:
            oldcmbd = pd.DataFrame.from_records(data=oldcmbd)
            oldnew_merged = pd.concat([cmbd,oldcmbd])
            oldnew_merged =  oldnew_merged[oldnew_merged['counts'].str.len() != 0]
            if len(oldnew_merged) < 1:
                return None
            oldnew_merged = oldnew_merged.groupby('Date')
            flattened = []
            # loop through groups
            for name, group in oldnew_merged:
                for obj in list(group["counts"]):
                    for item in obj:
                        flattened.append([name, item['Symbol'], item['Name'],item['n']])

            

            flattened = pd.DataFrame(flattened, columns = ['Date','Symbol','Name', 'n'])
            flattened = flattened.groupby(['Date','Symbol','Name'])['n'].sum().reset_index()
            transformed = []

            # loop through groups
            for name, group in flattened.groupby('Date'):
                objs = [{'Symbol':a, 'Name':b, 'n':c} for a,b,c in zip(group.Symbol, group.Name, group.n)]
                transformed.append([name, objs])
            
            cmbd = pd.DataFrame(transformed, columns = ['Date','counts'])
        
        cmbd = cmbd.to_json(orient='records', date_format=None)
        cmbd = json.loads(cmbd)

        return cmbd
