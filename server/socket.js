/*

    Work in progress

 */

var http = require('http');
var websocket = require('ws').Server;
var socketserver = new websocket({port: 9999});


module.exports = socketserver;