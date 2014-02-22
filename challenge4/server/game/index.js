lib = require('./lib');
Ball = require('./ball');
Player = require('./player');
Bot = require('./bot');
Paddle = require('./paddle');



module.exports = function(options) {
  var mode = options.mode;

  var player_left = null;
  var player_right = null;
  var ball = Ball({
    callback: function(direction) {
      if (direction === "right") {
        player_left.addScore();
      }
      if (direction === "left") {
        player_right.addScore();
      }
    }
  });

  function sendState() {
    data = {
      ball : {
        x: ball.left(),
        y: ball.top()
      },
      paddle_left : {
        x: player_left.paddle.left(),
        y: player_left.paddle.top()
      },
      paddle_right : {
        x: player_right.paddle.left(),
        y: player_right.paddle.top()
      },
      score_left : player_left.getScore(),
      score_right : player_right.getScore()
    };
    if (player_left.socket !== null && player_left.socket !== undefined) {
      player_left.socket.emit('update', data);
    }
    if (player_right.socket !== null && player_right.socket !== undefined) {
      player_right.socket.emit('update', data);
    }
  }

  function updateGame() {
    player_left.update();
    player_right.update();

    ball.update();

    player_left.paddle.setDirection(player_left.direction());
    player_right.paddle.setDirection(player_right.direction());

    ball.collide(player_left.paddle);
    ball.collide(player_right.paddle);

    player_left.paddle.update();
    player_right.paddle.update();

    sendState();
  }

  // Main loop.
  function start() {
    setInterval(function() {
      if (player_left === null) return;
      updateGame();
    }, 50);
  }

  var addPlayer = function(socket) {
    if (mode === "singleplayer") {
      var paddle_left = Paddle("left");
      var paddle_right = Paddle("right");

      player_left = Player({socket : socket, paddle: paddle_left});
      player_right = Bot({paddle: paddle_right, ball: ball});
      start();
    }
    else if (mode === "multiplayer") {
      if (player_left !== null && player_left !== undefined) {
        var paddle_left = Paddle("left");
        player_left = Player({socket : socket, paddle: paddle_left});
      }
      else {
        var paddle_right = Paddle("right");
        player_right = Player({socket : socket, paddle: paddle_right});
        start();
      }
    }

  };

  return {
    addPlayer : addPlayer
  }


};

