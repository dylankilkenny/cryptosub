from pymongo import MongoClient
from configparser import ConfigParser
import json
import os
import nltk

nltk.download('punkt')

parser = ConfigParser()
parser.read('config.conf')

# Connect to DB
if os.environ['ENV'] == "test":
    url = "mongodb://mongo/"
else:
    url = parser.get('db', 'url')
    
client = MongoClient(url)
db = client.dev

# Open setup file
with open('db_setup.json') as f:
    db_setup = json.load(f)

# If collection already exists
if "misc" in db.collection_names():
    print("Setup was already run, and collection exists in db. ")
    resp = input("Do you want to remove the collection and run setup again?(Y/N): ")
    if resp.upper() == "Y":
        db['misc'].drop()       

db.misc.insert_one(
    {
        "subs": db_setup["subs"],
        "cryptocurrencies": db_setup["cryptocurrencies"],
        "PostIDs": db_setup["PostIDs"],
        "stopwords": db_setup["stopwords"],
        "banned_users": db_setup["banned_users"]
    }
)

print("Setup complete!")