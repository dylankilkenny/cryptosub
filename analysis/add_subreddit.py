from pymongo import MongoClient
from configparser import ConfigParser
import json
import os

parser = ConfigParser()
parser.read('config.conf')

# Connect to DB
url = parser.get('db', 'url')

client = MongoClient(url)
db = client.dev

# Open setup file
with open('db_setup.json') as f:
    db_setup = json.load(f)
db.misc.update_one({},{
    "$set": {
        "subs": db_setup["subs"],
        "cryptocurrencies": db_setup["cryptocurrencies"]
    }
    
})

print("Subreddits and Cryptocurrencies updated!")