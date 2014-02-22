var express = require('express');


var game = require('./game/index.js');

var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

app.use("/js", express.static(__dirname + '/client/js'));
app.use("/css", express.static(__dirname + '/client/css'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/index.html');
});

io.sockets.on('connection', function (socket) {
  g = game("singleplayer");

  g.addPlayer(socket);
});