var Backlog = require('tailable-capped-array')
var assert = require('assert')

function User(opt) {
    assert(opt.email, 'User MUST have an e-mail!')
    this.email = opt.email
}

module.exports = User

module.exports.users = {}

module.exports.getOrCreate = function (obj) {
    assert(opt.email, 'User MUST have an e-mail!')

    return User.users[obj.email] =
        User.users[obj.email] ||
        new User(obj)
}

User.prototype = {
    getBacklog: function () {
        return this.backlog =
            this.backlog ||
            new Backlog(100);
    }
}

