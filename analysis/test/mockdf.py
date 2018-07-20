import pandas as pd
from faker import Faker
import time
import datetime
from random import randint

class MockDF:
    def __init__(self):
        self.dataframe = self.createDF()
    
    def createDF(self):
        fake = Faker()
        df_lst = []
        for _ in range(50):
            df_lst.append([
                fake.name(),
                fake.text(), 
                self.timestamp(fake.date()),
                randint(0, 1000)
            ])
        return pd.DataFrame(df_lst, columns=['Author', 'Text', 'Date', 'Score'])
    
    def getDataframe(self):
        return self.dataframe

    def timestamp(self, date):
        return datetime.datetime.strptime(date, "%Y-%m-%d").timestamp()

