lib = require('./lib');
Ball = require('./ball');
Player = require('./player');
Bot = require('./bot');
Paddle = require('./paddle');


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
