'use strict';

angular.module('veercApp')
.factory('socket', ['socketFactory', function (socketFactory) {
    var socket = socketFactory();
    return socket;
}]);
