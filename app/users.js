/**
  Управление пользователями
*/

var _ = require('underscore');
var Sync = require('sync');

/**
 * @clientRedis объект редис клиента
 */
module.exports = function (clientRedis) {
  var r = clientRedis;
  var countUsers = 'countUsers';

  return {
    getCountUsers: function(cb) {
      r.get(countUsers, function (err, res) {
        cb(err, res);
      })
    },

    getCountUsersReal: function(cb) {
      r.hlen('users', function (err, res) {
        cb(err, res);
      })
    },

    // users - хеш с информацией о пользователе
    addUser: function (user, cb) {
      if (!user) {
        cb('Нет информации о юзере', null);
        return;
      }
      var name = user.name;

      if (!name) {
        cb('Поле name должно быть обязательно', null);
        return;
      }

      var me = this;
      this._getIdByName(name, function(err, res) {
        if (res) {
          cb('Пользователь с таким именем уже есть в базе', null);
          return;
        } 

        me.createUniqueId(function (err, res) {
          if (err) {
            cb(err, null);
            return;
          }
          var id = res;

          // Добавление в свой хеш
          // и в общий список пользователей
          r.multi()
            .hmset("user:"+id, user)
            .hset('users', name, id)
            .exec(cb);
        });
      });      
    },

    getUserById: function (id, cb) {
      r.hgetall('user:'+id, cb);
    },

    getAllUsers: function (cb) {
      r.hgetall('users', function (err, res) {
        if (err) {
          cb(err);
          return;
        }

        cb(null, _.map(res, function (val, key) {
          var res = {};
          res.id = Number(val);
          res.name = key;
          return res;
        }));
      });
    },

    updateUser: function (id, params, cb) {
      var me = this;

      Sync(function () {
        if (params && params.name) {
          // Есть ли с таким именем id
          var _id = me._getIdByName.sync(me, params.name);

          if (!_id) {
            // Наш ю зверь хочет сменить name
            me.deleteUser.sync(me, id);
          } else if (id != _id) { 
            // Если не один и тотже юзверь
            throw 'Имя ' +params.name+ ' уже кем-то занято!';
          }
        }
        
      }, function (err, res) {
        if (err) {
          cb(err, null);
          return;
        }
        var multi = r.multi();
        multi.hmset("user:"+id, params);
        if (params && params.name) {
          multi.hset('users', params.name, id);
        }
        multi.exec(cb);
      });

      // r.hmset('user:'+id, params, cb);
    },

    deleteUser: function (id, cb) {
      // Нужно узнать name
      var me = this;

      Sync(function () {
        var user = me.getUserById.sync(me, id);
        var name = user.name;

        return name;
      }, function (err, name) {
        if (err) {
          cb(err);
          return;
        }
        r.multi()
          .hdel('users', name)
          .del('user:' + id)
          .exec(cb); 
      });
    },

    _getIdByName: function (name, cb) {
      r.hget('users', name, cb)
    },

    // Создаёт и возвращаеть уникальный ID
    createUniqueId: function(cb) {
      clientRedis.incr(countUsers, cb);
    }
  };
};