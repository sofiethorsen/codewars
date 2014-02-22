lib = require('./lib');

module.exports = function (options) {
  var paddle = options.paddle;
  var ball = options.ball;
  var latest_move_at = lib.unixTime();
  var max_move = 50;
  var _direction = "none";
  var score = 0;

  var addScore = function() {
    score++;
  };

  var getScore = function() {
    return score;
  };

  var _update = function(time) {
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