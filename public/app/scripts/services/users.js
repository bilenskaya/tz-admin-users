'use strict';

angular.module('usersApp')
  .factory('Users', function ($resource) {
    var Users = $resource('/users/:id',{}, {
      save: {
        method: 'POST',
        params: {id: 'add'},
        isArray: true
      },
      delete: {
        method: 'DELETE',
        isArray: true
      },
      update: {
        method: 'PUT',
        params: {id: '@id'},
        isArray: true
      }
    });

    return Users;
  });
