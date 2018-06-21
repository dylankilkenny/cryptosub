# cryptosub
Cryptocurrency subreddit tracker

## Requirements
* MongoDB (latest)
* Python3
* NodeJS


#### Download and install - Mac/Linux
```
$ git clone https://github.com/dylankilkenny/cryptosub.git
$ cd cryptosub/analysis
$ pip3 install -r requirements.txt
$ cd ../server
$ npm install
$ cd ../webapp
$ npm install
```

#### Running - Mac/Linux
##### Reddit Stream
`reddit.py` opens a connection to reddit with their streaming api. Relevant comments and posts and pushed through this connection and parsed to csv and saved to the `analysis/latest` directory. Each subreddit will have files, one for posts and one for comments.
```    
$ cd analysis
$ python3 reddit.py
``` 
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

