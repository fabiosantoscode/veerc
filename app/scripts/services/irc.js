'use strict';

angular.module('veercApp').service('IRC', function () {

    var connect = function (params) {
        console.log('Connecting user %s', params.nick);
    };

    return {
        connect: connect
    };
});
