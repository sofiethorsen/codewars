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

var ball = Ball();

function Player(options) {
  var paddle = options.paddle;
  var socket = options.socket;
  var _direction = "none";

  socket.on('paddleMove', function (data) {
    _direction = data.direction;
  });

  _update = function(time) {};

  return {
    direction : _direction,
    update : _update,
    paddle: paddle
  }
}

function Bot(options) {
  var paddle = options.paddle;
  var ball = options.ball;
  var latest_move_at = lib.unixTime();
  var max_move = HEIGHT/10;
  var _direction = "none";

  _update = function(time) {
    if (lib.unixTime() - latest_move_at < 333) {
        return; //yield
    }

    var paddle = player.paddle;

    var paddle_mid = paddle.top() + paddle.height()/2;
    var ball_mid = ball.top() + ball.height()/2;
    var move = ball_mid-paddle_mid; // + ball.ySpeed() * (60 / 3);

    move = Math.min(Math.max(move, -max_move), max_move);

    if (move < 0) {
      _direction = "up";
    }
    else if (move > 0) {
      _direction = "down";
    }
    else {
      direction = "none";
    }

    latest_move_at = unixTime();
  }

  return {
    direction : _direction,
    update : _update,
    paddle: paddle
  }

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
        },
        top: function() { return top; },
        bottom: function() { return top + PADDLE_HEIGHT; },
        left: function() { return left; },
        right: function() { return left + PADDLE_WIDTH; },
        width: function() { return PADDLE_WIDTH; },
        height: function() { return PADDLE_HEIGHT; },
        collides: function(ball) {
            if (!(this.right() < ball.left() ||
                  this.left() > ball.right() ||
                  this.bottom() < ball.top() ||
                  this.top() > ball.bottom())) {
                return true;
            } else {
                return false;
            }
        }

    };
};

var state;
var player = null;
var bot = null;

function resetGame (socket) {
  player = Player({socket : socket, paddle: paddle_left});
  bot = Bot({paddle: paddle_right, ball: ball});
}

exports.setPlayer = function(socket) {
  resetGame(socket);


  // data.id, data.direction
};

function updateGame() {
  player.update();
  bot.update();

  paddle_left.setDirection(player.direction);
  paddle_right.setDirection(bot.direction);

  paddle_left.update();
  paddle_right.update();

  // sendstate
}

// Main loop.
setInterval(function() {
  if (player === null) return;
  updateGame();
  player.socket.emit('update', state);
}, 1000);
