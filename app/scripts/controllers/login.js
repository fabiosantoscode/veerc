'use strict';

angular.module('veercApp').controller('LoginCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {

    $scope.user = {};

    $scope.login = function () {
        if ($scope.user && $scope.user.email) {
            $rootScope.user = { email: $scope.user.email };
            $location.path('/chat');
        } else {
            $scope.statusMessage = 'Login failed';
        }
    }

}]);
