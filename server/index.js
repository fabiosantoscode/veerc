/**
 * Main server
 */
var Backlog = require('tailable-capped-array')
var restify = require('restify')
var path = require('path')
var irc = require('irc')
var _ = require('underscore')

var server = restify.createServer({})
var pureServer = server.server

server.get(/.*/, restify.serveStatic({
    directory: path.join(__dirname, '../app'),
    default: 'index.html'
}))

var sockServer = require('socket.io').listen(pureServer)

sockServer.on('connection', function(sock) {
    sock.on('connect', function (obj) {
        console.log('connect event', obj)
        onUserConnect(obj, sock)
    })

    sock.on('error', function (err) { console.error(err) })
})

function onUserConnect(obj, sock) {
    var user = require('./user.js').getOrCreate(obj)

    var backlog = user.getBacklog()
    var backlogStream = backlog.createReadStream()

    backlogStream.on('data', function (data) {
        sock.emit('message', data)
    })

    console.log(obj)
    console.log('received a connect event from rogerio: connect')

    var ircClient = user.getIrcClient()

    ircClient.on('error', function (err) {
        sock.emit('upstream-error', err)
        console.error(err)
    })

    sock.on('message', function (msg, cb) {
        if (msg.to && 'content' in msg) {
            ircClient.say(msg.to, msg.content)
            backlog.push({
                command: 'PRIVMSG',
                rawCommand: 'PRIVMSG',
                commandType: 'normal',
                args: [msg.to, msg.content],
                nick: user.nick
            })
            cb && cb()
        }
    })

    sock.on('join', function (chan) {
        if (chan) {
            ircClient.join(chan)
        }
    })

    sock.on('part', function (chan) {
        if (chan) {
            ircClient.part(chan)
        }
    })
}

server.listen(3000)

