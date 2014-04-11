'use strict';

angular.module('veercApp').controller('LoginCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.login = function () {
        if ($scope.user && $scope.user.email) {
            $location.path('/chat');
        } else {
            $scope.statusMessage = 'Login failed';
        }
    }

}]);
