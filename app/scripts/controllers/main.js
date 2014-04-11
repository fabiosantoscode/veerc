'use strict';

angular.module('veercApp').controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {

    if (!$scope.user) {
        $location.path('/login');
    }
}]);
