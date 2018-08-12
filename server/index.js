const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const fetch = require("node-fetch");
const moment = require("moment");
const _ = require("lodash");
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// ---------  Database  ---------- //
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
let db;
MongoClient.connect(
  url,
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("dev");
    app.listen(3000); // start app listening on port 3000
    console.log("API Running!");
  }
);
// ------------------------------ //

//
// https://stackoverflow.com/questions/42761068/paginate-javascript-array
//
function paginate(array, page_size, page_number) {
  --page_number;
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
}

app.get("/", (req, res) => {
  res.send("CryptoAnalytics API!");
});

app.post("/AllSubreddits", (req, res) => {
  // Get documents from db
  db.collection("subreddits")
    .find()
    .project({
      one_day_change: 1,
      one_day_total: 1,
      seven_day_change: 1,
      seven_day_total: 1,
      thirty_day_change: 1,
      thirty_day_total: 1,
      currency_mentions: 1,
      id: 1
    })
    .toArray(function(err, result) {
      // Remove objects with low amount of data
      const filtered = result
        .filter(obj => {
          if (
            obj.one_day_change != null &&
            obj.one_day_total != null &&
            obj.one_day_change != "NA" &&
            obj.one_day_total != "NA"
          ) {
            return true;
          }
        })
        .sort((a, b) => b.thirty_day_total - a.thirty_day_total);

      // Paginate array
      const paginateArray = paginate(
        filtered,
        req.body.page_size,
        req.body.page_number
      );

      // update array of objects with most popular currency for each sub
      var updated = paginateArray.map(function(obj) {
        const currency_mentions = obj.currency_mentions;
        const most_popular = _.maxBy(currency_mentions, "n");

        return {
          most_popular: most_popular.Name,
          ...obj
        };
      });

      const response = {
        data: updated,
        page_number: req.body.page_number,
        page_size: req.body.page_size,
        total_size: filtered.length
      };
      // console.log(filtered)
      res.send(response);
    });
});

app.post("/Subreddit", (req, res) => {
  const subreddit = req.body.subreddit;
  db.collection("subreddits")
    .find({ id: req.body.subreddit })
    .project({
      _id: 0,
      id: 0,
      overall_user_score_head: 0,
      overall_user_score_tail: 0
    })
    .toArray(function(err, result) {
      res.send(result);
    });
});

app.post("/CommentsPostsByDay", (req, res) => {
  const subreddit = req.body.subreddit;
  db.collection("commentpostbd")
    .find({ id: req.body.subreddit })
    .project({
      comments_posts_by_day: 1
    })
    .toArray(function(err, result) {
      var all_days_arr = [];
      // add all objects from all documents into one array
      for (var doc of result) {
        all_days_arr = all_days_arr.concat(doc.comments_posts_by_day);
      }
      var formatted_dates = all_days_arr.map(function(obj) {
        return {
          MonthDay: new moment(obj.Date).format("MMM Do"),
          Moment: new moment(obj.Date),
          n: obj.n_comment + obj.n_post,
          ...obj
        };
      });
      // order by date in asc
      const ordered = _.orderBy(all_days_arr, ["Date"], ["asc"]);
      res.send(formatted_dates);
    });
});

app.post("/CurrencyMentionsByDay", (req, res) => {
  const subreddit = req.body.subreddit;
  db.collection("currencymentionsbd")
    .find({ id: subreddit })
    .project({
      currency_mentions_by_day: 1
    })
    .toArray(function(err, result) {
      var all_days_arr = [];
      // add all objects from all documents into one array
      for (var doc of result) {
        all_days_arr = all_days_arr.concat(doc.currency_mentions_by_day);
      }
      const ordered = _.orderBy(all_days_arr, ["Date"], ["asc"]);
      res.send(ordered);
    });
});

app.post("/WordCountByDay", (req, res) => {
  const subreddit = req.body.subreddit;
  db.collection("wordfreqbd")
    .find({ id: subreddit })
    .project({
      word_freq_by_day: 1
    })
    .toArray(function(err, result) {
      res.send(result);
    });
});

app.post("/BigramByDay", (req, res) => {
  const subreddit = req.body.subreddit;
  db.collection("bigramfreqbd")
    .find({ id: subreddit })
    .project({
      bigram_freq_by_day: 1
    })
    .toArray(function(err, result) {
      res.send(result);
    });
});

// Use this cors config for production, allowing authorized origins to connect
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  var allowedOrigins = [
    "http://localhost:8080",
    "http://cryptosub.live",
    "http://www.cryptosub.live"
  ];
  var origin = req.headers.origin;
  console.log(origin);
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", false);
  // Pass to next layer of middleware
  next();
});

module.exports = app;
