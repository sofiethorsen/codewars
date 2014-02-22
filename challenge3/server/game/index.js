console.log("game start");

var PADDLE_WIDTH = 20;
var PADDLE_HEIGHT = 50;

function Player(options) {

}

function Paddle(side) {
    var top = 0;
    var direction = 0;

    return {
        update: function() {

        }
    }
}

var state;
var player = null;

function resetGame (socket) {
  player = {socket : socket };
}

exports.setPlayer = function(socket) {
  resetGame(socket);


  // data.id, data.direction
  socket.on('paddleChange', function (data) {
    console.log(data);
  });

};

function updateGame() {
  // body...
}

// Main loop.
setInterval(function() {
  if (player === null) return;
  updateGame();
  player.socket.emit('update', state);
}, 1000);
