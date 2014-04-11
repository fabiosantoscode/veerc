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

var backlog = new Backlog(10 /* backlog size */)
var backlogStream = backlog.createReadStream()

var sockServer = require('socket.io').listen(pureServer)

sockServer.on('connection', function(sock) {
    backlogStream.on('data', function (data) {
        sock.emit('message', data)
    })
    sock.on('connect', function (obj) {
        console.log('received a connect event from rogerio: connect')

        var ircClient = new irc.Client(
            'irc.freenode.net',
            'veerc',
            { channels: ['#mtgsapo']
        });

        ircClient.on('raw', function (message) {
            backlog.push(message)
        })

        ircClient.on('error', function (err) {
            sock.emit('upstream-error', err)
            console.error(err)
        })

        sock.on('message', function (msg) {
            if (msg.to && 'content' in msg) {
                ircClient.say(msg.to, msg.content)
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
    })

    sock.on('error', function (err) { console.error(err) })
})

if (!module.parent) {  // Started from console
    server.listen(3000)
} else {  // required
    module.exports.sockServer = sockServer
    module.exports.server = server
}

