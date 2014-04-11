'use strict';

angular.module('veercApp', [
  'ngRoute',
  'btford.socket-io'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    })
    .when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
