#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Analyse reddit posts"""

import pandas as pd
import re
from afinn import Afinn
import numpy as np  
from nltk.corpus import stopwords
import nltk 
from collections import Counter
import json
import logging
import collections
from nltk.collocations import *
from pprint import pprint
import operator
from datetime import datetime, timedelta


class RedditAnalyser(object):

    def __init__(self, comments, posts, currency_symbols, stopwords, banned_path):

        # logging.basicConfig(filename='reddit_analyser.log',level=logging.DEBUG,
        # format='%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s', datefmt="%Y-%m-%d %H:%M:%S")
        self.afinn = Afinn()
        self.stopwords = stopwords
        self.banned_path = banned_path
        self.number_comments = len(comments.index)
        self.number_posts = len(posts.index)
        self.comments = self.CleanseData(comments, False)
        self.posts = self.CleanseData(posts, True)
        self.currency_symbols = currency_symbols

    def NoPostComments(self):
        nc = self.number_comments
        np = self.number_posts
        return (nc, np)
    
    def NoPostCommentsTotals(self, comment_posts_bd, period):
        # Create dataframe
        cpbd_df = pd.DataFrame.from_records(data=comment_posts_bd)
        cpbd_df['n'] = cpbd_df['n_comment'] + cpbd_df['n_post']
        # get the last row of dataframe
        last_row = cpbd_df.tail(1)
        # get the date in last row 
        last_row_date = last_row.iloc[0]["Date"] 
        # to object
        last_row_date = datetime.strptime(last_row_date,'%Y-%m-%d %H:%M:%S')
        # take the period (e.g. 1 day) away from the date
        date_minus_period = last_row_date - timedelta(days=period) 

        # Copy df
        df_1 = cpbd_df.copy()
        # Convert date to datetime
        df_1['Date'] = pd.to_datetime(df_1['Date'])
        # Find all rows between the 2 dates
        mask = (df_1['Date'] > date_minus_period) & (df_1['Date'] <= last_row_date)
        df_1 = df_1.loc[mask]
        

        # take the period away from date_minus_period
        previous_period = date_minus_period - timedelta(days=period)
        # copy df
        df_2 = cpbd_df.copy()
        # convert date to datetime
        df_2['Date'] = pd.to_datetime(df_2['Date'])
        # find all rows betweent he 2 datetimes
        mask = (df_2['Date'] > previous_period) & (df_2['Date'] <= date_minus_period)
        df_2 = df_2.loc[mask]
        
        # df_2['dist'] = abs(df_2['n'] - df_2['n'].median())
        # df_1['dist'] = abs(df_1['n'] - df_1['n'].median())
        current_period = df_1['n'].sum()
        previous_period = df_2['n'].sum()
        
        if previous_period > 0:
            pc_change = round(100 * (current_period - previous_period) / previous_period)
        else:
            pc_change = "NA"
        return pc_change, current_period


    def CommentsPostsByDay(self, oldcpbd):
        cbd = self.comments.copy()
        cbd = cbd.groupby(['Date']).size().to_frame('n_comment').reset_index()

        pbd = self.posts.copy()
        pbd = pbd.groupby(['Date']).size().to_frame('n_post').reset_index()

        cpbd = pd.merge(cbd, pbd, on='Date', how='outer')
        cpbd.fillna(0, inplace=True)                
        
        if oldcpbd != None:
            oldcpbd = pd.DataFrame.from_records(data=oldcpbd)
            oldnew_merged = pd.concat([cpbd,oldcpbd])
            oldnew_merged = oldnew_merged.groupby('Date').sum().reset_index()
            oldnew_merged = oldnew_merged.to_json(orient='records', date_format=None)
            oldnew_merged= json.loads(oldnew_merged)
            return oldnew_merged

        cpbd = cpbd.to_json(orient='records', date_format=None)
        return json.loads(cpbd)
    
    def MostActiveUsers(self, oldmau):
        mauc = self.comments.copy()
        mauc = mauc['Author'].value_counts().reset_index().rename(
            columns={'index': 'Author', 'Author': 'Comments'})

        maup = self.posts.copy()
        maup = maup['Author'].value_counts().reset_index().rename(
            columns={'index': 'Author', 'Author': 'Posts'}) 

        mau = pd.merge(maup, mauc, on='Author', how='outer')
        mau.fillna(0, inplace=True)        
        mau['Activity'] = mau['Comments'] + mau['Posts']
        mau = mau.sort_values(['Activity', 'Author'], ascending=[False, True]).head(100)

        if oldmau != None:
            oldmau = pd.DataFrame.from_records(data=oldmau)
            oldnew_merged = pd.concat([mau,oldmau])
            oldnew_merged = oldnew_merged.groupby('Author').sum().reset_index()
            oldnew_merged = oldnew_merged.to_json(orient='records', date_format=None)
            oldnew_merged= json.loads(oldnew_merged)
            return oldnew_merged
        mau = mau.to_json(orient='records', date_format=None)
        return json.loads(mau)

    def OverallUserScoreHead(self, oldous):
        ousc = self.comments.copy()
        ousc =  ousc.groupby('Author')['Score'].sum().reset_index().rename(
            columns={'Author': 'Author', 'Score': 'Comments'})

        ousp = self.posts.copy()
        ousp =  ousp.groupby('Author')['Score'].sum().reset_index().rename(
            columns={'Author': 'Author', 'Score': 'Posts'})

        ous = pd.merge(ousc, ousp, on='Author', how='outer').sort_values('Comments', ascending=False)
        ous.fillna(0, inplace=True)               
        ous['TotalScore'] = ous['Comments'] + ous['Posts']
        ous = ous.sort_values('TotalScore', ascending=False).head(100)

        if oldous != None:
            oldous = pd.DataFrame.from_records(data=oldous)
            oldnew_merged = pd.concat([ous,oldous])
            oldnew_merged = oldnew_merged.groupby('Author').sum().reset_index()
            oldnew_merged = oldnew_merged.to_json(orient='records', date_format=None)
            oldnew_merged= json.loads(oldnew_merged)
            return oldnew_merged
        ous = ous.to_json(orient='records', date_format=None)        
        return json.loads(ous)       

    def OverallUserScoreTail(self, oldous):
        ousc = self.comments.copy()
        ousc =  ousc.groupby('Author')['Score'].sum().reset_index().rename(
            columns={'Author': 'Author', 'Score': 'Comments'})

        ousp = self.posts.copy()
        ousp =  ousp.groupby('Author')['Score'].sum().reset_index().rename(
            columns={'Author': 'Author', 'Score': 'Posts'})

        ous = pd.merge(ousc, ousp, on='Author', how='outer').sort_values('Comments', ascending=False)
        ous['TotalScore'] = ous['Comments'] + ous['Posts']
        ous = ous.sort_values('TotalScore', ascending=False).tail(100)
        ous.fillna(0, inplace=True)        
        
        if oldous != None:
            oldous = pd.DataFrame.from_records(data=oldous)
            oldnew_merged = pd.concat([ous,oldous])
            oldnew_merged = oldnew_merged.groupby('Author').sum().reset_index()
            oldnew_merged = oldnew_merged.to_json(orient='records', date_format=None)
            oldnew_merged= json.loads(oldnew_merged)
            return oldnew_merged

        ous = ous.to_json(orient='records', date_format=None)
        return json.loads(ous)  

    def SentimentByDay(self, oldsbd):
        # Copy of comments and posts
        cs = self.comments.copy()
        ps = self.posts.copy()
        # Create a new column with sentiment score for eact piece of text
        cs['Comment_SA'] = np.array([ self.AnalyseSentiment(text) for text in cs['Text'] ])
        ps['Post_SA'] = np.array([ self.AnalyseSentiment(text) for text in ps['Text'] ])
        # Drop unneeded columns
        cs = cs.drop(['Author', 'Score', 'Text'], 1)
        ps = ps.drop(['Author', 'Score', 'Text'], 1)
        # Group and sum the scores by hour
        cs =  cs.groupby('Date')['Comment_SA'].sum().reset_index()
        ps =  ps.groupby('Date')['Post_SA'].sum().reset_index()
        # Merged the two dataframes, and drop and NA values
        sbd = pd.merge(cs, ps, on='Date', how='outer')
        sbd.fillna(0, inplace=True)                
        sbd["Sentiment"] = sbd["Comment_SA"] + sbd["Post_SA"]
        # If old data
        if oldsbd != None:
            # Create data frame from records
            oldsbd = pd.DataFrame.from_records(data=oldsbd)
            # Merge old and new data
            oldnew_merged = pd.concat([sbd,oldsbd])
            # Group by hour and sum sentiment scores
            oldnew_merged = oldnew_merged.groupby('Date').sum().reset_index()
            # Convert dataframe to json
            oldnew_merged = oldnew_merged.to_json(orient='records', date_format=None)
            oldnew_merged= json.loads(oldnew_merged)
            # Retrun json array
            return oldnew_merged
        # Convert dataframe to json
        sbd = sbd.to_json(orient='records', date_format=None)
         # Retrun json array     
        return json.loads(sbd)
    
    def Bigram(self, oldb):
        """
        Creating a list of bigram frequencies from the gathered 
        reddit comments and posts
        """
        comments = self.comments.copy()
        comment_counts = collections.Counter()
        for sent in comments["Text"]:
            words = nltk.word_tokenize(sent)
            comment_counts.update(nltk.bigrams(words))
        bc = pd.DataFrame(list(comment_counts.items()), columns=['bigram', 'n_comment'])

        posts = self.posts.copy()
        post_counts = collections.Counter()
        for sent in posts["Text"]:
            words = nltk.word_tokenize(sent)
            post_counts.update(nltk.bigrams(words))
        bp = pd.DataFrame(list(post_counts.items()), columns=['bigram', 'n_post'])

        bigram = pd.merge(bc, bp, on='bigram', how='outer')
        bigram.fillna(0, inplace=True)        
        bigram['n'] = bigram['n_comment'] + bigram['n_post']
        bigram["bigram"] = bigram["bigram"].apply(lambda x: ' '.join(x))
        self.bigram = bigram
        bigram = bigram.sort_values('n', ascending=False).head(500)        
        if oldb != None:
            oldb = pd.DataFrame.from_records(data=oldb)
            oldnew_merged = pd.concat([bigram,oldb])
            oldnew_merged = oldnew_merged.groupby('bigram').sum().reset_index()
            oldnew_merged = oldnew_merged.to_json(orient='records', date_format=None)
            oldnew_merged= json.loads(oldnew_merged)
            return oldnew_merged
        bigram = bigram.to_json(orient='records', date_format=None)
        
        return json.loads(bigram)
    
    def BigramByDay(self, oldbigrams):
        # Merge both datasets
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
        bbd = []
        # loop through groups
        for name, group in merged:
            merged_counts = collections.Counter()
            # Loop through text counting bigrams
            for sent in group["Text"]:
                words = nltk.word_tokenize(sent)
                merged_counts.update(nltk.bigrams(words))
            updated = {}
            # join bigrams to one word
            for key, value in merged_counts.most_common(25):
                k = ' '.join(key)
                updated[k] = value
            # append grouped date and counted bigrams to list
            bbd.append([name, updated])

        # Create dataframe with counts
        bbd = pd.DataFrame(bbd, columns = ['Date','counts'])
        
        if oldbigrams != None:
            oldbigrams = pd.DataFrame.from_records(data=oldbigrams)
            oldnew_merged = pd.concat([bbd,oldbigrams])
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
       
        bbd = bbd.to_json(orient='records', date_format=None)
        bbd = json.loads(bbd)
        return bbd
  

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

    def CurrencyMentions(self, oldcm):
        # Currency mentions single word
        word_count = self.word_count
        bigram = self.bigram
        cm = self.currency_symbols.copy()
        cm['Symbol'] = cm.Symbol.str.lower()
        cm['Name'] = cm.Name.str.lower()
        cm["Mentions_Sym"] = 0
        cm["Mentions_Name"] = 0

        for symbol in cm['Symbol']:
            c = word_count.loc[word_count['word'] == symbol, 'n'].values
            if len(c) > 0:
                cm.loc[cm['Symbol'] == symbol, 'Mentions_Sym'] = c[0]

        for name in cm['Name']:
            if len(name.split()) == 1:
                c = word_count.loc[word_count['word'] == name, 'n'].values
                if len(c) > 0:
                    cm.loc[cm['Name'] == name, 'Mentions_Name'] = c[0]
            else:
                c = bigram.loc[bigram['bigram'] == name, 'n'].values
                if len(c) > 0:
                    cm.loc[cm['Name'] == name, 'Mentions_Name'] = c[0]
        
        cm["n"] = cm["Mentions_Name"] + cm["Mentions_Sym"]

        if oldcm != None:
            oldcm = pd.DataFrame.from_records(data=oldcm)
            oldnew_merged = pd.concat([cm,oldcm])
            oldnew_merged = oldnew_merged.groupby(["Name", "Currency", "Symbol"]).sum().reset_index()
            oldnew_merged = oldnew_merged.to_json(orient='records', date_format=None)
            oldnew_merged= json.loads(oldnew_merged)
            return oldnew_merged

        cm = cm.to_json(orient='records', date_format=None)
        return json.loads(cm)
    
    def CurrencyMentionsByDay(self, oldcmbd):
        
        # Merge both datasets
        comments = self.comments.copy()
        posts = self.posts.copy()
        # Change date format from timestamp
        comments["Date"] = pd.to_datetime(comments['Date'], errors='coerce')
        posts["Date"] = pd.to_datetime(posts['Date'], errors='coerce')
        # Convert back to string date without hours
        comments["Date"] = comments["Date"].dt.strftime('%Y-%m-%d %H:00:00')
        posts["Date"] = posts["Date"].dt.strftime('%Y-%m-%d %H:00:00')
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
        bigram = pd.DataFrame(bigram, columns = ['Date','counts'])
        # Create dataframe with counts
        word_count = pd.DataFrame(word_count, columns = ['Date','counts'])

        # Create merged dataframe
        merged = {"Date": word_count["Date"], "word_count": word_count["counts"], "bigram_count": bigram["counts"]}
        merged = pd.DataFrame(data=merged)
        
        # Group by date
        merged = merged.groupby('Date')
        
        cm = self.currency_symbols.copy()
        cm['Symbol'] = cm.Symbol.str.lower()
        cm['Name'] = cm.Name.str.lower()
        cm = cm.drop('Currency', 1)
        cm["Mentions_Sym"] = 0
        cm["Mentions_Name"] = 0


        cmbd = [] 
        for date, group in merged:
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
            
            transformed = pd.DataFrame(transformed, columns = ['Date','counts'])
            transformed = transformed.to_json(orient='records', date_format=None)
            transformed= json.loads(transformed)
            return transformed
        # bit of a hack. removes rows where no counts have been found
        cmbd =  cmbd[cmbd['counts'].str.len() != 0]
        if len(cmbd) < 1:
                return None
        cmbd = cmbd.to_json(orient='records', date_format=None)
        cmbd = json.loads(cmbd)

        return cmbd

    def CurrencyByAuthor(self, oldcba):
        # Merge both datasets
        comments = self.comments.copy()
        posts = self.posts.copy()
        merged = pd.concat([posts,comments]) 

        merged_grouped = merged.groupby('Author')

        bigram = []
        word_count = []        
        # loop through groups
        for name, group in merged_grouped:
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
        bigram = pd.DataFrame(bigram, columns = ['Author','counts'])
        # Create dataframe with counts
        word_count = pd.DataFrame(word_count, columns = ['Author','counts'])
        # Create merged dataframe
        merged = {"Author": word_count["Author"], "word_count": word_count["counts"], "bigram_count": bigram["counts"]}
        merged = pd.DataFrame(data=merged)
        # Group by date
        merged = merged.groupby('Author')


        
        cm = self.currency_symbols.copy()
        cm['Symbol'] = cm.Symbol.str.lower()
        cm['Name'] = cm.Name.str.lower()
        cm = cm.drop('Currency', 1)
        cm["Mentions_Sym"] = 0
        cm["Mentions_Name"] = 0

        cba = [] 
        for author, group in merged:
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
            for i, item in temp_cm.iterrows():
                cba.append([author, item['Symbol'], item['Name'],item['n']])

        
        cba = pd.DataFrame(cba, columns = ['Author','Symbol', 'Name', 'n'])
        if cba.size < 1:
            return None
        cba = cba.groupby(['Symbol','Name', 'Author'])['n'].sum().reset_index()
        cba = cba.sort_values('n',ascending=False)       
        cba = cba.groupby('Symbol').head(20) 


        transformed = []
        for name, group in cba.groupby(['Symbol','Name']):
            objs = [{'Author':a, 'n':b} for a,b in zip(group.Author, group.n)]
            transformed.append([name[0], name[1], objs])

        cba = pd.DataFrame(transformed, columns = ['Symbol', 'Name', 'counts'])
        

        if oldcba != None:
            
            oldcba = pd.DataFrame.from_records(data=oldcba)
            oldnew_merged = pd.concat([cba,oldcba])
            oldnew_merged = oldnew_merged.groupby(['Symbol','Name'])
            flattened = []
            # loop through groups
            for name, group in oldnew_merged:
                for obj in list(group["counts"]):
                    for item in obj:
                        flattened.append([name[0], name[1], item['Author'], item['n']])

            

            flattened = pd.DataFrame(flattened, columns = ['Symbol','Name','Author','n'])
            flattened = flattened.groupby(['Author','Symbol','Name'])['n'].sum().reset_index()
            flattened = flattened.sort_values('n',ascending=False).groupby('Symbol').head(20)      
            
            transformed = []
            for name, group in flattened.groupby(['Symbol','Name']):
                objs = [{'Author':a, 'n':b} for a,b in zip(group.Author, group.n)]
                transformed.append([name[0], name[1], objs])

            transformed = pd.DataFrame(transformed, columns = ['Symbol', 'Name', 'counts'])
            # print("cba.size: " + str(transformed.size))
            
            transformed = transformed.to_json(orient='records', date_format=None)
            transformed= json.loads(transformed)
            return transformed
        # print("cba.size: " + str(cba.size))
        cba.to_csv('../data/reddit/cba.csv' , sep=',', index=False)
        cba = cba.to_json(orient='records', date_format=None)
        cba = json.loads(cba)
        return cba
         
    def CleanText(self, text):
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", str(text)).split())

    def AnalyseSentiment(self, text):
        analysis = self.CleanText(text)
        return self.afinn.score(analysis)

    def CleanseData(self, source, posts):
        #Change date format
        source["Date"] = pd.to_datetime(source["Date"],unit='s')        
        #Create df object
        if posts:
            data = {"Author": source["Author"], "Text": source["Title"], "Date": source["Date"], "Score": source["Score"] }  
        else:
            data = {"Author": source["Author"], "Text": source["Body"], "Date": source["Date"], "Score": source["Score"] }
        #Create df
        data = pd.DataFrame(data=data)
        #Convert datetime to date
        data["Date"] = data["Date"].dt.strftime('%Y-%m-%d %H:00:00')
        #Remove URLs  
        data["Text"] =  data['Text'].str.replace(r'http\S+', '', case=False)
        #Remove Na's
        data = data.dropna(how='any',axis=0)
        #Remove punctuation
        data["Text"] = data["Text"].str.replace('[^\w\s]','')
        #To lower case
        data['Text'] = data.Text.str.lower()
        #Remove Stop words
        stop = self.stopwords['word'].tolist()
        data["Text"] = data["Text"].apply(lambda x: ' '.join([word for word in x.split() if word not in stop]))
        with open(self.banned_path, "r") as jsonFile:
            users = json.load(jsonFile)
        data = data[~data['Author'].isin(users["users"])]       
        return data
