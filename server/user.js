var Backlog = require('tailable-capped-array')
var assert = require('assert')
var irc = require('irc')

function User(opt) {
    assert(opt.email, 'User MUST have an e-mail!')
    this.email = opt.email
    this.channels = opt.channels
    this.nick = opt.nick
}

module.exports = User

module.exports.users = {}

module.exports.getOrCreate = function (obj) {
    assert(obj.email, 'User MUST have an e-mail!')

    return User.users[obj.email] =
        User.users[obj.email] ||
        new User(obj)
}

User.prototype = {
    getBacklog: function () {
        return this.backlog =
            this.backlog ||
            new Backlog(100)
    },

    getIrcClient: function () {
        if (!this.ircClient) {
            this.ircClient = new irc.Client(
                'irc.freenode.net',
                this.nick,
                { channels: this.channels })
            this.ircClient.on('raw', function (message) {
                this.backlog.push(message)
            }.bind(this))
        }

        return this.ircClient
    }
}

