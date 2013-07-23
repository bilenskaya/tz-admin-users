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


app.get('/users', function (req, res, next) {
  res.json({sdf: 'LOL'});
});

module.exports = app;