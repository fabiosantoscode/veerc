'use strict';

angular.module('veercApp')
.controller('ChatCtrl', ['$rootScope', '$scope', '$location', 'socket', function ($rootScope, $scope, $location, socket) {

    $scope.user = {};
    $scope.log = [];

    if (!$rootScope.user) {
        // $location.path('/login');
        console.log('User is not logged');
    }

    $scope.send = function () {
        socket.emit('message', { to: '#mtgsapo', content: $scope.message }, function () {
            $scope.message = '';
        });
    }

    $scope.connect = function () {
        $scope.user.hasSetup = true;

        socket.emit(
            'connect',
            {
                nick: $scope.nick,
                channels: $scope.channels.split(','),
                email: $rootScope.user.email
            }
        );

        socket.on('message', function (data) {
            $scope.log.push(data);
            console.log(data);
        });
    }
}]);
