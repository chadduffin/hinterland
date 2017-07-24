"use strict";

process.title = "game-server";

var Port                    = process.env.PORT || 8081;
var Dict                    = require("collections/dict");
var Http                    = require("http");

var Tokens                  = new Dict();
var Clients                 = new Dict();

var HttpServer = Http.createServer(function(request, response) {
  /* HTTP REQUESTS HERE */
});

HttpServer.listen(Port, function() {
  /* SERVER BEGINS LISTENING HERE */
});

var SocketIO                = require("socket.io")(HttpServer);

SocketIO.on("connection", function (socket) {
  /* client initialization */
  socket.on("init", function (message) {
    var ip    = message.ip;
    var token = message.token;
    
    if (typeof Clients.get(token) !== "undefined") {
      var value = Clients.get(token);
      value.socket = socket.id;
      Clients.set(token, value);

      Tokens.set(socket.id, token);

      console.log("Reconnection.");
      return;
    }

    try {
      var options = {
        port: 8080,
        hostname: ip,
        path: "/profile",
        method: "GET",
        headers: {"Cookie": "connect.sid=" + String(token)}
      }

      var request = Http.request(options, function(response) {
        if (response.statusCode == 200) {
          Tokens.set(socket.id, token);
          Clients.set(token, {
            socket: socket.id,
            lastPing: Date.now()
          });
          console.log("Connection.");
        }
      });

      request.end();
    }

    catch (error) {
      console.log(error);
    }
  });

  /* client data */
  socket.on("data", function (message) {
    console.log(message);
  });

  /* client disconnection */
  socket.on("disconnect", function() {
    Tokens.delete(socket.id);
    console.log("Disconnection.");
  });
});

setInterval(function() {
  Clients.forEach(function(value, key) {
    if ((Tokens.has(value.socket) == false) &&
        (Date.now()-value.lastPing > 10000)) {
      Clients.delete(key);
    }
  });
}, (1000));
