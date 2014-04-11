'use strict';

angular.module('veercApp')
.controller('ChatCtrl', ['$rootScope', '$scope', '$location', 'IRC', function ($rootScope, $scope, $location, IRC) {

    if (!$rootScope.user) {
        // $location.path('/login');
        console.log('User is not logged');
    }

    $scope.connect = function () {
        $rootScope.user.hasSetup = true;
        IRC.connect({ nick: $scope.nick, channels: $scope.channels.split(',') });
    }
}]);
