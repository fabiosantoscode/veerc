'use strict';

angular.module('veercApp').controller('MainCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {

    if (!$rootScope.user) {
        $location.path('/login');
    } else {
        $location.path('/chat');
    }
}]);
