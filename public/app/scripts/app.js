'use strict';

angular.module('usersApp', ['ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'UserCtrl'
      })
      .when('/add', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })      
      .when('/edit/:id', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })      
      .otherwise({
        redirectTo: '/'
      });
  });
