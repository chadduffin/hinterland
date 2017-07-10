"use strict";

process.title = 'game-server';

var webSocketsServerPort    = process.env.PORT || 32768;
var webSocketServer         = require('websocket').server;
var mysql                   = require('mysql');
var http                    = require('http');

var clients                 = [];

var mysql = mysql.createConnection({
  host: "",
  port: "",
  user: "",
  password: "",
  database: ""
});

var server = http.createServer(function(request, response) {
  /* HTTP REQUESTS HERE */
  var url                   = request.url;
  var method                = request.method;

  if ((method === "GET") && (url === "/clients")) {
    response.write("empty");
    response.end();
  }
});

server.listen(webSocketsServerPort, function() {
  /* SERVER BEGINS LISTENING HERE */
});

var wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

  var connection            = request.accept(null, request.origin); 
  var index                 = clients.push(connection)-1;
  var userName              = false;

  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
     if (userName === false) {
        userName = message.utf8Data;
        connection.sendUTF(JSON.stringify({type:'single', data: 'data'}));
      } else {
        var json = JSON.stringify({type:'broadcast', data: 'data'});

        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
      }
    }
  });

  connection.on('close', function(connection) {
    if (userName !== false) {
      console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
      clients.splice(index, 1);
    }
  });
});
