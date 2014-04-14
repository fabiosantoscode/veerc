'use strict';

angular.module('veercApp')
.service('MessageParser', function () {

    var ping = function (msg) {
        return false;
    };

    var privmsg = function (msg) {
        // TODO: parse stuff
        return msg;
    };

    var parse = function (msg) {
        if (msg.command === 'PING') {
            return ping(msg);
        } else if (msg.command === 'PRIVMSG') {
            return privmsg(msg);
        } else {
            // nothing to do here
            return false;
        }
    };

    return {
        parse: parse
    }
});
