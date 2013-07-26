expect = require('chai').expect
request = require 'supertest'
app = require '../../app/main'
redis = require('redis')
clientRedis = redis.createClient()

createUser = (params, cb = ->) ->
  request(app)
    .post('/users/add')
    .send(params)
    .end(cb)

describe 'API Users', ->

  afterEach ->
    clientRedis.flushdb();

  it 'should error responce on undefined res', (done) ->
    request(app)
      .get('/undefined')
      .expect(404, done)

  it 'should empty array users list', (done) ->
    request(app)
    .get('/users')
    .expect('Content-Type', /json/)
    .expect(200)
    .end (err, res) ->
      throw err if err
      r = res?.body
      expect(r).to.eqls []
      done()

  describe 'add users', ->
    _user = Object.freeze
      name: 'zoh'
      email: 'zoh@bk.ru'
      age: '24'
      gender: 'male'
    _user2 = Object.freeze name: 'lol'
    _user3 = Object.freeze name: 'lol2'

    beforeEach (done) ->
      createUser _user, done

    it 'should get user', (done) ->
      request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end (err, res) ->
        throw err if err
        r = res?.body
        expect(r[0]).to.eqls id: 1, name: 'zoh'
        done()

    it 'should get a few users', (done) ->
      createUser _user2, ->
        createUser _user3, ->
          request(app).get('/users').end (err, res) ->
            expect(res.body.length).to.eq 3
            done()

    it 'should get error for double add user', (done) ->
      createUser _user, (err, res) ->
        expect(res.status).to.eq 500
        expect(res.body?.message).to.eq 'Пользователь с таким именем уже есть в базе'
        done()

    it 'get user (all info) by id', (done) ->
      request(app).get('/users/1').end (err, res) ->
        expect(res.body).to.eqls _user
        done()

    it 'get count (real) users', (done) ->
      createUser _user2, ->
        request(app).get('/users/count').end (err, res) ->
          expect(res?.body).to.eq 2
          done()

    it 'should delete user', (done) ->
      request(app).del('/users/1').end ->
        request(app).get('/users/1').end (err, res) ->
          expect(res.body).to.eqls {}
          done()

    it 'should update user', (done) ->
      request(app).put('/users/1')
      .send(name: 'lol', email: 'not email')
      .end (err, res) ->
        request(app).get('/users/1').end (err, res) ->
          expect(res.body).to.eqls 
            name: 'lol'
            email: 'not email'
          done()