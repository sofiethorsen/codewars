lib = require('./lib');
var WIDTH = 1000;
var HEIGHT = 500;

Ball = require('./ball');

var PADDLE_WIDTH = 20;
var PADDLE_HEIGHT = 50;
var PADDLE_SPEED = 10;

var ball = Ball({
  callback: function(direction) {
    if (direction === "right") {
      player.addScore();
    }
    if (direction === "left") {
      bot.addScore();
    }
  }
});

function Player(options) {
  var paddle = options.paddle;
  var socket = options.socket;
  var _direction = "none";

  socket.on('paddleMove', function (data) {
    _direction = data.direction;
  });

  var score = 0;

  var addScore = function() {
    score++;
  };

  var getScore = function() {
    return score;
  };

  _update = function(time) {};

  var direction = function () { return _direction }

  return {
    direction : direction,
    update : _update,
    paddle: paddle,
    socket: socket,
    getScore: getScore,
    addScore: addScore
  }
}

function Bot(options) {
  var paddle = options.paddle;
  var ball = options.ball;
  var latest_move_at = lib.unixTime();
  var max_move = HEIGHT/10;
  var _direction = "none";
  var score = 0;

  var addScore = function() {
    score++;
  };

  var getScore = function() {
    return score;
  };

  _update = function(time) {
    if (lib.unixTime() - latest_move_at < 333) {
        return; //yield
    }

    var paddle_mid = paddle.top() + paddle.height()/2;
    var ball_mid = ball.top() + ball.height()/2;
    var move = ball_mid - paddle_mid; // + ball.ySpeed() * (60 / 3);

    move = Math.min(Math.max(move, -max_move), max_move);


    if (move < 0) {
      _direction = "up";
    }
    else if (move > 0) {
      _direction = "down";
    }
    else {
      _direction = "none";
    }


    latest_move_at = lib.unixTime();
  }

  var direction = function () { return _direction; };

  return {
    direction : direction,
    update : _update,
    paddle: paddle,
    getScore: getScore,
    addScore: addScore
  };
}

function Paddle(side) {
    var top = 0;
    var left = side == "left" ? 0 : WIDTH - PADDLE_WIDTH;
    var direction = 0;

    return {
        height: function() {
            return PADDLE_HEIGHT;
        },
        setDirection: function(dir) {
            if (dir === "up") {
                direction = -1;
            } else if (dir === "down") {
                direction = 1;
            } else {
                direction = 0;
            }
        },
        update: function() {
            top += direction * PADDLE_SPEED;
            top = Math.max(Math.min(500 - this.height(), top), 0);
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
  var paddle_left = Paddle("left");
  var paddle_right = Paddle("right");

  player = Player({socket : socket, paddle: paddle_left});
  bot = Bot({paddle: paddle_right, ball: ball});
}

exports.setPlayer = function(socket) {
  resetGame(socket);
};


function sendState() {

  data = {
    ball : {
      x: ball.left(),
      y: ball.top()
    },
    paddle_left : {
      x: player.paddle.left(),
      y: player.paddle.top()
    },
    paddle_right : {
      x: bot.paddle.left(),
      y: bot.paddle.top()
    },
    score_left : player.getScore(),
    score_right : bot.getScore()
  }

  player.socket.emit('update', data);
}

function updateGame() {
  player.update();
  bot.update();

  ball.update();

  player.paddle.setDirection(player.direction());
  bot.paddle.setDirection(bot.direction());

  ball.collide(player.paddle);
  ball.collide(bot.paddle);

  player.paddle.update();
  bot.paddle.update();

  sendState();
}

// Main loop.
setInterval(function() {
  if (player === null) return;
  updateGame();
}, 50);
