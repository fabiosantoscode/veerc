/**
 * Main server
 */
var restify = require('restify')
var irc = require('irc')
var ws = require('ws')

var server = restify.createServer({})
var pureServer = server.server

server.get(/.*/, restify.serveStatic({
    directory: '../app',
    default: 'index.html'
}))

var ircClient = new irc.Client(
    'irc.freenode.net',
    'veerc',
    { channels: ['#mtgsapo'] }
);

function getIrcClient(socket) { /* TODO */ return ircClient }

var sockServer = new ws.Server({ server: pureServer })

sockServer.on('connection', function(sock) {
    var ircClient = getIrcClient(sock)
    ircClient.on('raw', function (message) {
        sock.send(JSON.stringify(message))
    })
    sock.on('message', function (msg) {
        msg = JSON.parse(msg)
        if (msg.type === 'message') {
            ircClient.say(msg.to, msg.content)
        } else if (msg.type === 'join') {
            ircClient.join(msg.chan)
        } else if (msg.type === 'part') {
            ircClient.part(msg.chan)
        }
    })
})

server.listen(9000)

