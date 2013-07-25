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

app.use(express.bodyParser());
app.all('*', function (req, res, next) {
  next();
});

app.users = users;
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