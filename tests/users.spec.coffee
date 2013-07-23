
redis = require('redis')
clientRedis = redis.createClient()
Users = require '../app/users'

describe 'Users model', ->

  beforeEach ->
    @users = Users clientRedis

  it 'should be test ok', ->
    console.log 'OK!'