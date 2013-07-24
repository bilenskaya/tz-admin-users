expect = require('chai').expect
redis = require('redis')
Sync = require 'sync'
_ = require 'underscore'

clientRedis = redis.createClient()
clientRedis.select 11
Users = require '../app/users'

describe 'Users model', ->

  user = null

  beforeEach ->
    clientRedis.flushdb()
    @users = Users clientRedis

  it 'get count all users', (done) ->
    clientRedis.set 'countUsers', 11
    @users.getCountUsers (err, res) ->
      expect(res).to.eql '11'
      done()

  it 'should get unique id users', (done) ->
    Sync =>
      r1 = @users.createUniqueId.future null
      r2 = @users.createUniqueId.future null
      r3 = @users.createUniqueId.future null

      [r1.result, r2.result, r3.result]
    , (err, res) ->
      throw err if err

      expect(res[0]).to.eq 1
      expect(res[1]).to.eq 2
      expect(res[2]).to.eq 3

      done()

  it 'should get unique id users with start value', (done) ->
    clientRedis.set 'countUsers', 11
    Sync =>
      r1 = @users.createUniqueId.future null
      r2 = @users.createUniqueId.future null
      r3 = @users.createUniqueId.future null

      [r1.result, r2.result, r3.result]
    , (err, res) ->
      throw err if err
      expect(res[0]).to.eq 12
      expect(res[1]).to.eq 13
      expect(res[2]).to.eq 14
      done()

  describe 'create new user', ->

    _user = Object.freeze
      name: 'zoh'
      email: 'zoh@bk.ru'
      age: '24'
      gender: 'male'

    _user2 = Object.freeze name: 'lol'
    _user3 = Object.freeze name: 'lol2'

    beforeEach (done) ->
      clientRedis.set 'countUsers', 22
      @users.addUser _user, done

    it 'should get new increment id', (done) ->
      clientRedis.get 'countUsers', (err, res) ->
        expect(res).to.eql '23'
        done()

    it 'should return error for user without name', (done) ->
      @users.addUser {}, (err, res) ->
        expect(err).to.eq 'Поле name должно быть обязательно'
        done()

    it 'should save id hash-redis user:<id>', (done) ->
      clientRedis.get 'countUsers', (err, res) ->
        clientRedis.hgetall "user:#{res}", (err, res) ->
          expect(res).to.eqls _user
          done()

    it 'save another users', (done) ->
      Sync =>
        @users.addUser.sync @users, _user2
        @users.addUser.sync @users, _user3
      , (err, res) ->
        throw err if err
        clientRedis.get 'countUsers', (err, res) ->
          expect(res).to.eql '25'
          clientRedis.keys 'user:*', (err, res) ->
            expect(res).to.include 'user:23','user:24','user:25'
            done()

    it 'should save in all hash list users', (done) ->
      clientRedis.hexists 'users', _user.name, (err, res) ->
        expect(res).to.be.ok
        done()

    it 'should error for double name user', (done) ->
      @users.addUser name: 'zoh', (err, res) ->
        expect(err).to.be.ok # Должна прийти ошибка
        expect(res).to.be.not.ok
        done()

    describe 'get users', ->
      beforeEach (done) ->
        Sync =>
          @users.addUser.sync @users, _user2
          @users.addUser.sync @users, _user3
        , (err, res) ->
          done()
      # У нас адйишники 23, 24, 25
      it 'one by id', (done) ->
        @users.getUserById 23, (err, res) ->
          expect(res).to.eqls _user
          done()

      it 'get all list', (done) ->
        @users.getAllUsers (err, res) ->
          expect(res).to.have.property('length')
          expect(res[0]).to.eqls id: 23, name: _user.name
          expect(res[1]).to.eqls id: 24, name: _user2.name
          expect(res[2]).to.eqls id: 25, name: _user3.name
          done()


    describe 'update & delete user', ->

      it 'should set new params and replace older', (done) ->
        _new_user = _.clone _user
        _new_user.email = '23efwfsdf23'
        _new_user.name = 'lol'

        @users.updateUser 23, _new_user, (err, res) =>
          @users.getUserById 23, (err, res) ->
            expect(res).to.be.eqls _new_user
            clientRedis.hgetall 'users', (err, res) ->
              expect(res).to.eqls lol: '23'
              done()


      it 'should set new params and replace older', (done) ->
        _new_user = _.clone _user
        _new_user.email = '23efwfsdf23'
        _new_user.name = 'lol2'

        @users.addUser name: 'lol', (err, res) =>
          @users.updateUser 23, _new_user, (err, res) =>
            #expect(err).to.be.ok
            clientRedis.hgetall 'users', (err, res) ->
              expect(res).to.eqls lol: '24', lol2: '23'
              done()

      it 'should clear all info', (done) ->
        Sync =>
          @users.deleteUser.sync @users, 23
          r = clientRedis.hgetall.sync clientRedis, 'user:23'
          expect(r).to.be.not.ok
          r = clientRedis.hget.sync clientRedis, 'users', _user.name
          expect(r).to.be.not.ok
        , (err, res) ->
          throw err if err
          done()