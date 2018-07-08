import pandas as pd
import json
from datetime import datetime, timedelta

class CommentsPosts(object):
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
        self.number_comments = len(self.comments)
        self.number_posts = len(self.posts)
        self.comments_posts_by_day = None
    
    def GetNumCommentsPosts(self):
        return self.number_comments, self.number_posts
    
    def CommentsPostsActivity(self, period):
        """
        Calculates the number of posts and comments (activity) occuring 
        within a given period, e.g. 1 day period
        """
        # Create dataframe and add a new column
        cpbd_df = pd.DataFrame.from_records(data=self.comments_posts_by_day)
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
        
        current_period = df_1['n'].sum()
        previous_period = df_2['n'].sum()
        
        if previous_period > 0:
            pc_change = round(100 * (current_period - previous_period) / previous_period)
        else:
            pc_change = "NA"

        return pc_change, current_period
    
    def CommentsPostsByDay(self, oldcpbd = None):
        """
        Calculates the number of comments and posts occuring on a subreddit
        each day. The grouping is done on the Date column, which is accurate 
        to within a specific hour e.g. 29/06/2018 14:00:00. 

        Old data(comments and posts per day), if it exists, is merged with the
        latest data and returned.
        """
        # Copy comments and posts dataframes
        cbd_copy = self.comments.copy()
        pbd_copy = self.posts.copy()
        # Group by date, assigning the number of post/comments to a new column
        # and merge the two dataframes into one.
        cbd = cbd_copy.groupby(['Date']).size().to_frame('n_comment').reset_index()
        pbd = pbd_copy.groupby(['Date']).size().to_frame('n_post').reset_index()
        cpbd = pd.merge(cbd, pbd, on='Date', how='outer')
        cpbd.fillna(0, inplace=True)

        
        # oldcpbd contains any previous comments and posts by date information
        # which was retrieved for the db. The latest comments and posts 
        # will be merged with any old info
        if oldcpbd != None:
            oldcpbd = pd.DataFrame.from_records(data=oldcpbd)
            oldnew_merged = pd.concat([cpbd,oldcpbd])
            oldnew_sum = oldnew_merged.groupby('Date').sum().reset_index()
            cpbd = oldnew_sum
        
        self.comments_posts_by_day = cpbd

        cpbd = cpbd.to_json(orient='records', date_format=None)
        return json.loads(cpbd)