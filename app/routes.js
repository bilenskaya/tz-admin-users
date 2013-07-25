/**
  Роутинг 
*/

module.exports = function (app) {
  var Users = app.users;

  app.get('/users', function (req, res, next) {
    Users.getAllUsers(function (err, $res) {
      if (err) {
        next(err);
      }
      res.json($res);
    });
  });

  app.get('/users/count', function (req, res, next) {
    Users.getCountUsersReal(function (err, $res) {
      if (err) {
        next(err);
      }
      res.json($res);
    });
  });

  app.get('/users/:id', function (req, res, next) {
    var id = req.params.id;
    if (!id) next('Не передан id');
    Users.getUserById(id, function (err, $res) {
      if (err) {
        next(err);
      }
      res.json($res);
    });
  });

  app.put('/users/:id', function (req, res, next) {
    var id = req.params.id;
    if (!id) next('Не передан id');
    Users.updateUser(id, req.body, function (err, $res) {
      if (err) next(err);
      res.json($res);
    });
  });

  app.delete('/users/:id', function (req, res, next) {
    var id = req.params.id;
    if (!id) next('Не передан id');
    Users.deleteUser(id, function (err, $res) {
      if (err) {
        next(err);
      }
      res.json($res);
    });
  });

  app.post('/users/add', function (req, res, next) {
    Users.addUser(req.body, function (err, $res) {
      if (err) {
        next(err);
      }
      res.json($res);
    });
  });  
};