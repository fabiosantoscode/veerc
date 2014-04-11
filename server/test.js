var ws = require('ws')
var ok = require('assert')
var server = require('./index.js').server
var sinon = require('sinon')

describe('ws server', function () {
    var serverPort = 7878
    var serverAddr = 'ws://localhost:' + serverPort
    beforeEach(function (done) {
        server.listen(serverPort, done)
    })
    afterEach(function (done) {
        server.close()
        setTimeout(done, 100)
    })

    describe('with a connection', function () {
        var sock
        beforeEach(function (done) {
            sock = new ws(serverAddr);
            sock.on('open', function () { setTimeout(done, 1500) });
        })

        messageTests(function () { return sock })

        describe('with a connection which is not the first', function() {
            beforeEach(function (done) {
                setTimeout(function () { sock.close() }, Math.random() * 500)
                setTimeout(function () {
                    sock = new ws(serverAddr);
                    sock.on('open', function () {
                        done();
                    })
                }, (Math.random() * 500) + 500)
            })

            messageTests(function () { return sock })
        })
    })
})

function messageTests(sock) {
    it('doesn\'t break on bad JSON', function (done) {
        sock().send('{ badjson }', done)
    })

    it('talks on IRC', function (done) {
        var theMessage = Math.random() + 'Hello!'
        sock().send(JSON.stringify({ type: "message", content: theMessage, to: '#mtgsapo'}), function () {
            done();
        })
    })

    it('doesn\'t break on bad messages', function (done) {
        sock().send(JSON.stringify({ type: 'message', content: 'foo' }), done)
    })

    afterEach(function () {
        console.error.restore && console.error.restore()
    })
    it('doesn\'t break on messages to the wrong channel', function (done) {
        sinon.stub(console, 'error', function () {
            done()
        })
        sock().send(JSON.stringify({ type: 'message', content: 'foo', to: 'rongChannel' }))
    })
}

