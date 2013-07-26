'use strict';

angular.module('usersApp')
  .controller('MainCtrl', function ($scope, $timeout) {
    $scope.errors = [];

    $scope.$on('errors', function ($e, message) {
      $scope.errors.push(message);
      $timeout(function(){
        $scope.errors.shift();
      }, 2500);
    });
  });
