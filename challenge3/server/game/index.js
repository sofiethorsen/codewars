lib = require('./lib');

var PADDLE_WIDTH = 20;
var PADDLE_HEIGHT = 50;
var PADDLE_SPEED = 10;
var WIDTH = 1000;
var HEIGHT = 500;
var BALL_WIDTH = 25;
var BALL_HEIGHT = 25;  

var paddle_left = Paddle("left");
var paddle_right = Paddle("right");

function Ball (argument) {

  var speedX, speedY, x, y;

  function resetBall() {
    x = node.position().left;
    y = 100 + Math.random() * 300;
    speedX = lib.random() * 5;
    speedY = lib.random() * 5;
    // Speed should be at least 5
    speedX =+ lib.sign(speedX) * 5;
    speedY =+ lib.sign(speedY) * 5;
  };
  resetBall();

  var hitPaddle = function() {
    speedX *= 1.2;
    speedY *= 1.2;
    speedX = -speedX;
  };

  var _get = function() {
    return {x: x, y: y}
  }; 

  var _update = function () {
    x = lib.limit(x + speedX, 0, WIDTH-BALL_WITH);
    y = lib.limit(y + speedY, 0, HEIGHT-BALL_HEIGHT);

    if (y === 0 || y === HEIGHT-BALL_HEIGHT) {
      speedY = -speedY;
    }

    if (x === 0) {
      resetBall();
      console.log("someone lost")
    }
    if (x === (WIDTH-BALL_WITH)) {
      resetBall();
      console.log("someone lost")
    }
  };

  return {
    get: _get,
    update: _update
  };
}


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
