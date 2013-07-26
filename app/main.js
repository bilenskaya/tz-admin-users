/**
  Главное приложение на express
**/

var express = require('express');
var app = express();
var redis = require('redis');
var clientRedis = redis.createClient();
var users = require('./users')(clientRedis);

clientRedis.on('error', function (error) {
  console.log(error);
});

allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
}

app.use(allowCrossDomain);
app.use(express.static('public/dist/'));
app.use(express.bodyParser());
app.all('*', function (req, res, next) {
  next();
});

app.users = users;

app.get('/', function (req, res) {
  res.render('public/index.html');
});
require('./routes')(app);

app.use(function (req, res, next) {
  res.json(404, {
    message: "Не найден ресурс " 
    + req.method + ':' + req.url
  });
});

app.use(function (err, req, res, next){
  res.json(500, {message: err});
});


module.exports = app;