module.exports = function (options) {
  var paddle = options.paddle;
  var socket = options.socket;
  var direction = "none";
  var score = 0;

  socket.on('paddleMove', function (data) {
    direction = data.direction;
  });

  return {
    direction : function () { return direction;},
    update : function(time) {},
    paddle: paddle,
    socket: socket,
    getScore: function() { return score;},
    addScore: function() {score++;}
  }
}