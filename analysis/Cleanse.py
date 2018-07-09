import pandas as pd

class Cleanse(object):

    def __init__(self, comments, posts, stopwords, banned_users):
        # disable SettingWithCopyWarning
        # https://stackoverflow.com/a/20627316/4254021

        pd.options.mode.chained_assignment = None

        self.stopwords = stopwords
        self.banned_users = banned_users

        self.comments = self.Comments(comments)
        self.posts = self.Posts(posts)
        
        
    def getData(self):
        return self.comments, self.posts
    
    def Comments(self, comments):
        
        # Create obj
        data = {"Author": comments["Author"], "Text": comments["Body"], "Date": comments["Date"], "Score": comments["Score"] }
        
        #Change date format
        data["Date"] = pd.to_datetime(data["Date"],unit='s') 
        
        #Create df
        data = pd.DataFrame(data=data)

        return self.Cleanse(data)

    def Posts(self, comments):

        # Create obj
        data = {"Author": comments["Author"], "Text": comments["Title"], "Date": comments["Date"], "Score": comments["Score"] }
        
        #Change date format
        data["Date"] = pd.to_datetime(data["Date"],unit='s') 
        
        #Create df
        data = pd.DataFrame(data=data)

        return self.Cleanse(data)

    def Cleanse(self, data):

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

        # Remove banned users
        users = self.banned_users
        data = data[~data['Author'].isin(users)]

        return data
        