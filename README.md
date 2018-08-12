# cryptosub
Cryptocurrency subreddit tracker

## Requirements
* MongoDB
* Python3
* NodeJS


#### Download and install - Mac/Linux
```
$ git clone https://github.com/dylankilkenny/cryptosub.git
$ cd cryptosub
$ virtualenv .
$ source bin/activate
$ make
```

#### Running
Before running any of the components, make sure a mongodb instance is running on localhost with the default port.
##### Subreddit Analysis
The /analysis folder contains all the files required for collecting and analysisng reddit submissions. Currently there are 2 processes for collecting submissions, `reddit.py` which listens for new posts and `historical.py` which gathers old posts. You will need to generate OAuth keys from https://github.com/reddit-archive/reddit/wiki/OAuth2 and put them, and your login details in `/analysis/config.conf`
```    
$ cd analysis
$ python3 reddit.py
``` 
By running reddit.py a connection will be opened to reddit.com in order to stream and all comments which match our filter will be parsed and saved to a csv in the `analysis/latest` directory. Files will begin to build up in this directory, and in order to be analysised `main.py` will need to be called. Currently i have a cronjob which calls main.py once every hour.

`historical.py` gathers old submissions on reddit and is entirely optional. Two dates need to be passed in epoch timestamp format when running this script.

`$ python3 historical.py 1534108501 1533158101`
The first argument is the start date (e.g. 12/08/2018) and the second argument is the end date (e.g. 01/08/2018)


##### Server
A NodeJS server with expressJS retrieves data from the MongoDB database and sends it to the Web App. 
Runs on port 3000
```    
$ cd server
$ npm run dev
``` 
##### Web App
ReactJS web application
```    
$ cd webapp
$ npm start
``` 
#### Data analysis
Running `main.py` in the analysis directory will move all files being gathered by `reddit.py` from `analysis/latest` to `analysis/working`. The files in the working directory will then be analysed and data saved to the database.

