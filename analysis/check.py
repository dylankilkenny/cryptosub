import requests
import json
import numpy as np

prices = requests.get("https://api.coinmarketcap.com/v1/ticker/?limit=0")
prices = json.loads(prices.text)

with open("db_setup.json", "r") as db:
    data = json.load(db)

lst = []

for i in prices:
    if int(i["rank"]) < 250:
        lst.append({
            "Currency": i["id"],
            "Name": i["name"],
            "Symbol": i["symbol"]
        })

data["cryptocurrencies"] = lst

with open('db_setup.json', 'w') as outfile:
    json.dump(data, outfile)

# current_symbols = [i["Symbol"] for i in data["cryptocurrencies"]]
# new_symbols = [i["symbol"] for i in prices if int(i["rank"]) < 250]
# main_list = np.setdiff1d(new_symbols, current_symbols, assume_unique=True)
# ranks = []

# print(ranks)
# print("*" * 30)
# print(new_symbols)
# print("*" * 30)
# print(main_list)