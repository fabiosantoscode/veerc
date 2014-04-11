/**
 * Main server
 */
var websocketAsStream = require('websocket-stream')
var Backlog = require('tailable-capped-array')
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

ircClient.on('raw', function (message) {
    backlog.push(JSON.stringify(message))
})

ircClient.on('error', function (err) { console.error(err) })

var backlog = new Backlog(10 /* backlog size */)
var backlogStream = backlog.createReadStream()

var sockServer = new ws.Server({ server: pureServer })

sockServer.on('connection', function(sock) {
    sock = websocketAsStream(sock)

    backlogStream.pipe(sock)
    sock.on('data', function (msg) {
        try {
            msg = JSON.parse(msg)
        } catch(e) {
            backlogStream.push(JSON.stringify({ error: 'Dude, wrong JSON ' + e }))
        }

        fail: {
            if (msg.type === 'message') {
                if (msg.to && 'content' in msg) {
                    ircClient.say(msg.to, msg.content)
                }
            } else if (msg.type === 'join') {
                if (msg.chan) {
                    ircClient.join(msg.chan)
                }
            } else if (msg.type === 'part') {
                if (msg.chan) {
                    ircClient.part(msg.chan)
                }
            } else { break fail; }
            return;
        }

        backlogStream.push(JSON.stringify({ error: 'Dude, you sent a bad message and shite' }))
    })

    sock.on('error', function (err) { console.error(err) })
})

if (!module.parent) {  // Started from console
    server.listen(9000)
} else {  // required
    module.exports.sockServer = sockServer
    module.exports.server = server
}
