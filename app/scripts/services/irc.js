'use strict';

angular.module('veercApp').service('IRC', function () {

    var connect = function (params) {
        console.log('COnnecting');
    };

    return {
        connect: connect
    };
});
