/**
 * Main server
 */
var irc = require('irc');
var engine = require('engine.io');

var server = engine.listen(8888);
console.log('Listening for connections...');

var clients = {};

server.on('connection', function (socket) {

    socket.on('message', function (data) {
        console.log('Received: %s', data);
        parseRequest(JSON.parse(data));
    });

    function parseRequest(req) {
        if (req.action && req.action === 'connect') {
            connect(req.params);
        } else {
            console.log('Invalid request');
            socket.send({ status: 'error' });
        }
    }

    function connect(params) {
        var client = new irc.Client(
            params.server,
            params.nick,
            { channels: params.channels }
        );

        client.addListener('error', function (err) {
            console.log(err);
        });

        client.addListener('raw', function (msg) {
            var resp = { type: 'irc', content: msg };
            resp = JSON.stringify(resp);
            socket.send(resp);
        });

        clients[params.clientID] = client;
    }
});
