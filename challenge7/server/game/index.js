lib = require('./lib');
Ball = require('./ball');
Player = require('./player');
Bot = require('./bot');
Paddle = require('./paddle');
Block = require('./block');
constants = require('./constants');



module.exports = function(options) {
  var mode = options.mode;

  var player_left = null;
  var player_right = null;
  var game_loop = null;
  var blocks = [];
  var balls = [];

  function createBall (argument) {
    return  Ball({
        callback: function(ball, direction) {
          if (direction === "right") {
            player_left.addScore();
          }
          if (direction === "left") {
            player_right.addScore();
          }

          balls.splice(balls.indexOf(ball), 1);

          if (balls.length == 0) {
            balls.push(createBall());
          }

        }
    });
  }

  balls.push(createBall());

  function sendToPlayers (evt, data) {

    if (player_left.socket !== null && player_left.socket !== undefined) {
      player_left.socket.emit(evt, data);
    }
    if (player_right.socket !== null && player_right.socket !== undefined) {
      player_right.socket.emit(evt, data);
    }

  }

  function sendState() {


    blocks_data = [];

    for (var i = blocks.length - 1; i >= 0; i--) {
      blocks_data.push({
        x : blocks[i].left(),
        y : blocks[i].top(),
        width : blocks[i].width(),
        height : blocks[i].height(),
        visible : blocks[i].visible(),
        special: blocks[i].special(),
      })
    };

    balls_data = [];
    for (var i = balls.length - 1; i >= 0; i--) {
      balls_data.push({
        x : balls[i].left(),
        y : balls[i].top(),
      });
    };    

    data = {
      balls: balls_data,
      paddle_left : {
        x: player_left.paddle.left(),
        y: player_left.paddle.top()
      },
      paddle_right : {
        x: player_right.paddle.left(),
        y: player_right.paddle.top()
      },
      score_left : player_left.getScore(),
      score_right : player_right.getScore(),
      blocks : blocks_data
    };

    sendToPlayers("update", data);
  }

  function updateGame() {
    player_left.update();
    player_right.update();
    player_left.paddle.setDirection(player_left.direction());
    player_right.paddle.setDirection(player_right.direction());


    for (var i = balls.length - 1; i >= 0; i--) {
      balls[i].update();
      balls[i].collide(player_left.paddle);
      balls[i].collide(player_right.paddle);

      for (var j = blocks.length - 1; j >= 0; j--) {
        if (blocks[j].collides(balls[i])) {
          blocks[j].hide();
          balls[i].hitBlock(blocks[j]);
          if (blocks[j].special) {
            balls.push(createBall());
          }
        }
      };
    };

    player_left.paddle.update();
    player_right.paddle.update();

    sendState();
  }

  // Main loop.
  function start() {
    console.log("start")
    //blocks.push( new Block({top : 150, left : 250}));
    for (var i = 0; i < 7; i++) {
      blocks.push(Block({top : 10 + (constants.BLOCK_HEIGHT + 15) * i, left : 260 - constants.BLOCK_WIDTH / 2}));
    }
    game_loop = setInterval(function() {
      if (player_left === null) return;
      updateGame();
    }, 50);
  }

  var addPlayer = function(socket) {
    if (mode === "singleplayer") {
      var paddle_left = Paddle("left");
      var paddle_right = Paddle("right");

      player_left = Player({socket : socket, paddle: paddle_left});
      player_right = Bot({paddle: paddle_right, balls: balls});
      start();
    }
    else if (mode === "multiplayer") {
      console.log("multiplayer");
      if (player_left === null) {
        console.log("first player");
        var paddle_left = Paddle("left");
        player_left = Player({socket : socket, paddle: paddle_left});
      }
      else {
        console.log("second player");
        var paddle_right = Paddle("right");
        player_right = Player({socket : socket, paddle: paddle_right});
        start();
      }

    }

  };

  var _stop = function () {
    console.log("stopping game");
    clearInterval(game_loop);
    sendToPlayers("quit", {data : "someone quit"});
  }

  return {
    addPlayer : addPlayer,
    stop : _stop
  };


};

