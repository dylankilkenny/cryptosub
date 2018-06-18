const express = require('express')
const app = express()
const fs = require('fs')
const cors = require('cors')
const fetch = require('node-fetch')
var _ = require('lodash');
var moment = require('moment');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(cors())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// ---------  Database  ---------- //
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
let db;
MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err)
    db = client.db('dev')
    app.listen(3000) // start app listening on port 3000
})
// ------------------------------ //


app.get('/', (req, res) => {
    res.send("CryptoAnalytics API!")
})

app.get('/Subreddits', (req, res) => {
    // Get documents from db
    db.collection('subreddits').find().project({
        "one_day_change":1,
        "one_day_total":1,
        "seven_day_change":1,
        "seven_day_total":1,
        "thirty_day_change":1,
        "thirty_day_total":1,
        "currency_mentions":1,
        "id":1
    }).toArray(function(err, result) {
        // Remove objects with low amount of data
        const filtered = result.filter(obj => {
            if (obj.one_day_change != null && 
                obj.one_day_total != null &&
                obj.one_day_change != 'NA' && 
                obj.one_day_total != 'NA'){
                return true
            }
        })
        // update array of objects with most popular currency for each sub
        var updated = filtered.map(function (obj) {
            const currency_mentions = obj.currency_mentions;
            const most_popular = _.maxBy(currency_mentions, 'Mentions_Sym');
            return {
                most_popular: most_popular.Name,
                ...obj
            }
        })
        res.send(updated)
    }) 
})

//Use this cors config for production, allowing authorized origins to connect
// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     var allowedOrigins = ['http://localhost:3000', "http://api.cryptoanalytics.ml"];
//     var origin = req.headers.origin;
//     if (allowedOrigins.indexOf(origin) > -1) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', false);
//     // Pass to next layer of middleware
//     next();
// });

module.exports = app;