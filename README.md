# cryptosub
Cryptocurrency subreddit tracker - Work in progress!

## Requirements
* MongoDB
* Python3
* NodeJS


### Download and install - Mac/Linux
```console
$ git clone https://github.com/dylankilkenny/cryptosub.git
$ cd cryptosub
$ virtualenv .
$ source bin/activate
$ make
```

### Running locally
Before running any of the components, make sure a mongodb instance is running on localhost with the default port.
#### Subreddit Analysis
The `/analysis` folder contains all the files required for collecting and analysisng reddit submissions. Currently there are 2 processes for collecting submissions, `reddit.py` which listens for new posts and `historical.py` which gathers old posts. You will need to generate OAuth keys for reddit. Follow this guide https://github.com/reddit-archive/reddit/wiki/OAuth2 and put the keys, and your login details in `/analysis/config.conf`
```console
$ cd analysis
$ python3 reddit.py
``` 
By running reddit.py a stream connection will be opened to reddit.com. A filter is sent when opening the connection indicating which subreddits I am interested in. All comments which match our filter will be pushed through the connection, parsed, and saved to a csv in the `analysis/latest` directory. Files will begin to build up in this directory, and in order to be analysised, `main.py` needs to be called. In production I set up a cronjob which calls `main.py` once every hour.

`historical.py` gathers old submissions on reddit and is entirely optional. Two dates need to be passed in epoch timestamp format when running this script.

```console
$ python3 historical.py 1534108501 1533158101
```
The first argument is the start date (e.g. 12/08/2018) and the second argument is the end date (e.g. 01/08/2018)


#### Server
A NodeJS server with expressJS retrieves data from the MongoDB database and sends it to the Web App. 
Runs on port 3000
```console
$ cd server
$ npm run-script dev
``` 
#### Web App
ReactJS web application
```console    
$ cd webapp
$ npm run-script dev
``` 
Navigate to http://localhost:8080/

