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
            { nick: $scope.nick, channels: $scope.channels.split(',') }
        );

        socket.on('message', function (data) {
            $scope.log.push(data);
            console.log(data);
            var newLine = document.createElement('p');
            newLine.className = 'log-line';
            newLine.innerHTML = moment().format() + ' &gt; ' + '<strong>' + (data.nick || 'Chanserv') + ':</strong> ' + data.args[1];
            var chatArea = document.getElementsByClassName('chat-area')[0]
            chatArea.appendChild(newLine);
            chatArea.scrollTop = 9999999999;

        });
    }
}]);
