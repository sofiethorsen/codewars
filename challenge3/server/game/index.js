lib = require('./lib');
Ball = require('./ball');

console.log(Ball);

var PADDLE_WIDTH = 20;
var PADDLE_HEIGHT = 50;
var PADDLE_SPEED = 10;
var WIDTH = 1000;
var HEIGHT = 500;


var paddle_left = Paddle("left");
var paddle_right = Paddle("right");



function Player(options) {

}

function Paddle(side) {
    var top = 0;
    var left = side == "left" ? 0 : WIDTH - PADDLE_WIDTH;
    var direction = 0;

    return {
        height: function() {
            return PADDLE_HEIGHT;
        },
        setDirection: function(direction) {
            if (direction == "up") {
                direction = -1;
            } else if (direction == "down") {
                direction = 1;
            } else {
                direction = 0;
            }
        },
        update: function() {
            top += direction * PADDLE_SPEED;
            top = Math.min(500 - this.height(), top);
        }

    };
};

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
