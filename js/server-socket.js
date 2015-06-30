var http = require('http');
var sockjs = require('sockjs');
var socket = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/0.3.4/sockjs.min.js' });

var server = http.createServer();

socket.installHandlers(server, {prefix:'/game'});
server.listen(9999, 'braith');

module.exports = socket;