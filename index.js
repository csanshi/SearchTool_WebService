// const redis = require('redis');
// const client = redis.createClient(6379, '127.0.0.1');
const someFuncs = require('./utils/someFuncs')
const echo = someFuncs.echo
const crub = someFuncs.CRUB
const config = require('./config')

const express = require('express');
const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.all('*', function (req, res, next) {
    echo('...app.all')
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
})


function error(status, msg) {
	var err = new Error(msg);
	err.status = status;
	return err;
}

// map of valid api key, typically mapped to account info with some sort of database like redis.
// api keys do _not_ serve as authentication, merely to track API usage or help prevent malicious behavior etc.

app.use('/api', function (req, res, next) {
	var key = req.query['api-key'];

	// key isn't present
	if(!key) return next(error(400, 'api key required'));

	// key is invalid
	if(!~config.apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

	// all good, store req.key for route access
	req.key = key;
	next();
});

app.get('/api/getConfirmedData', function(req, res){
	echo('request received：getConfirmedData');
    crub.getConfirmedData(function(err, result){
      if(err) throw err
      res.json(result);
    })
});

app.get('/api/getUnconfirmedData', function(req, res){
  echo('request received: getAllUnconfirmedData');
  crub.getUnconfirmedData(function (err, result) {
    if(err) throw err;
    res.json(result)
  })
});

app.get('/api/getFeedback', function (req, res) {
    echo('request received: getFeedback');
    crub.getFeedback(function (err, result) {
        if(err) throw err;
        res.json(result)
    })
})

app.post('/api/login', function (req, res) {
  echo('request received: login');
  var condition = req.body
  crub.getAdmin(condition, function (err, result) {
    if(err) throw err;
    res.json(result)
  })
})



app.post('/api/addUnconfirmedData', function (req, res) {
  echo('request received');
  var fields = req.body
  crub.addUnconfirmedData(fields, function (err, result) {
    if(err) throw err;
    res.end();
  })
});

app.get('/api/submitUnconfirmedData', function (req, res) {
  echo('request received: submitNewInfo')
  var id = req.query.id
  crub.submitUnconfirmedData(id, function (err, result) {
    if(err) throw err;
    res.end()
  })
})

app.post('/api/updateUnconfirmedData', function (req, res) {
    echo('request received: updateUnconfirmedData');
    var fields = req.body
    var id = fields._id
    delete fields._id
    crub.updateUnconfirmedData(id, fields, function (err, result) {
        if(err) throw err;
        res.end();
    })
})

app.get('/api/deleteUnconfirmedData', function (req, res) {
    echo('request received: deleteUnconfirmedData')
    var id = req.query.id
    crub.deleteUnconfirmedData(id, function (err, result) {
        if(err) throw err;
        res.end()
    })
})



app.get('/api/addFeedback', function (req, res) {
    echo('request received: submitErrorInfo')
    var id = req.query.id
    var errInfo = req.query.errInfo
    crub.addFeedback(id, errInfo, function (err, result) {
        if(err) throw err;
        res.end()
    })
})

app.get('/api/deleteFeedback', function (req, res) {
    echo('request received: deleteFeedback')
    var id = req.query.id
    crub.deleteFeedback(id, function (err, result) {
        if(err) throw err;
        res.end()
    })
})

app.post('/api/updateConfirmedDataAccordingToFeedback', function (req, res) {
  echo('request received: updateConfirmedDataAccordingToFeedback')
  var fields = req.body
  crub.updateConfirmedDataAccordingToFeedback(fields, function (err, result) {
    if(err) throw err;
    res.end();
  })
})

app.listen(config.PORT, function () {
	echo('The server is running on :', config.HOST + ':' + config.PORT);
});
