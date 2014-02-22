var express = require('express');


var Game = require('./game/index.js');

var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

app.use("/js", express.static(__dirname + '/client/js'));
app.use("/css", express.static(__dirname + '/client/css'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/index.html');
});






var waiting_game = null;
io.sockets.on('connection', function (socket) {
  var game;

  socket.on("disconnect", function() {
    game.stop();
  });

  socket.on("newGameMode", function (mode) {
    if (mode === "singelplayer") {
      console.log("NEW GAME")
      game = new Game({mode : "singelplayer" }); 
    }

    if (mode === "multiplayer") {
      if (waiting_game == null) {
        console.log("NEW GAME")
        game = new Game({mode : "multiplayer" });
        waiting_game = game;
      }
      else {
        console.log("GAME exists");
        game = waiting_game;
        waiting_game = null;
      }
    }

   game.addPlayer(socket);
  
  });

});