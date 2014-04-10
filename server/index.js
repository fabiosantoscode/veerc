/**
 * Main server
 */
var restify = require('restify')

var server = restify.createServer({})

server.get(/.*/, restify.serveStatic({
    directory: '../app',
    default: 'index.html'
}))

server.listen(9000)

