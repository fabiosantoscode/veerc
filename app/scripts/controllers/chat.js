'use strict';

angular.module('veercApp')
.controller('ChatCtrl', ['$rootScope', '$scope', '$location', 'socket', 'MessageParser', function ($rootScope, $scope, $location, socket, MessageParser) {

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
            if (data.command !== 'PING') {
                $scope.log.push(data);
            }
            setTimeout(function () {
                document.querySelector('.chat-area').scrollTop = 999999;
            }, 10)
            console.log(data);
        });
    }
}]);
