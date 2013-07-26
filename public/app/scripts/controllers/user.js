'use strict';

angular.module('usersApp')
  .controller('UserCtrl', function ($scope, $routeParams, Users, $location) {
    var path = $location.path();

    var $error = function (data) {
      $scope.$emit('errors', data.data.message);
    };

    $scope.saveUser = function (form) {
      if (path.match('edit')) {
        form.id = $routeParams.id;
        Users.update(form, function () {
          $location.path('/');
        }, $error);
      } else {
        Users.save(form, function () {
          $location.path('/');
        }, $error);
      }
    };

    $scope.deleteUser = function (id) {
      Users.delete({id: id}, function () {
        $scope.users = Users.query();
      }, $error);
    };

    $scope.edit = function (id) {
      $location.path('/edit/' + id);
    };

    if (path == '/') {
      $scope.users = Users.query();
    }

    if (path == '/add') {
      $scope.action = 'add';
    }

    if (path.match('edit')) {
      $scope.action = 'edit';
      $scope.form = Users.get({id: $routeParams.id});
    }
});
