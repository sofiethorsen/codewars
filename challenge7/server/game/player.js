module.exports = function (options) {
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