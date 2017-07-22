"use strict";

process.title = 'game-server';

var Port                    = process.env.PORT || 8081;
var Http                    = require('http');

var HttpServer = Http.createServer(function(request, response) {
  /* HTTP REQUESTS HERE */
});

HttpServer.listen(Port, function() {
  /* SERVER BEGINS LISTENING HERE */
});

var SocketIO                = require('socket.io')(HttpServer);

var Clients                 = [];

SocketIO.on('connection', function (socket) {
  console.log("New connection.");

  socket.on('credentials', function (message) {
    console.log(message);

    var options = { 
        hostname: String(message.ip),
        port: 8080,
        path: '/profile',
        method: 'GET',
        headers: {'Cookie': 'connect.sid='+String(message.token)}
    };

    console.log(options);

    var test;

    var req = Http.request(options, function(response) {
      test = response.statusCode;
    });

    console.log(test);

    req.end();
  });

  socket.on('message', function (message) {
    console.log(message);
  });
});
