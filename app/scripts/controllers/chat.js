'use strict';

var module = angular.module('veercApp');

module.controller('ChatCtrl', ['$rootScope', '$scope', '$location', 'MessageParser', 'socket',
                     function ( $rootScope ,  $scope ,  $location ,  MessageParser ,  socket ) {

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
            console.log(data);
            var message = MessageParser.parse(data);
            console.log(message);
            if (message) {
                $scope.log.push(message);
            }
            setTimeout(function () {
                document.querySelector('.chat-area').scrollTop = 999999;
            }, 0);
        });
    }
}]);
