lib = require('./lib');
var WIDTH = 1000;
var HEIGHT = 500;
module.exports = function (options) {
  var BALL_WIDTH = 25;
  var BALL_HEIGHT = 25;

  var callback = options.callback;
  var speedX, speedY, x, y;
  var latestHit = null;

  function resetBall() {
    x = 500;
    y = 100 + Math.random() * 300;
    speedX = lib.random() * 5;
    speedY = lib.random() * 5;
    // Speed should be at least 5
    speedX =+ lib.sign(speedX) * 5;
    speedY =+ lib.sign(speedY) * 5;
    latestHit = null;

  };
  resetBall();

  var top     = function()    { return y;};
  var bottom  = function()    { return y+BALL_HEIGHT;};
  var left    = function()    { return x;};
  var right   = function()    { return x+BALL_WIDTH;};
  var width   = function()    { return BALL_WIDTH;};
  var height   = function()    { return BALL_HEIGHT;};

  var hitPaddle = function() {
    speedX *= 1.2;
    speedY *= 1.2;
    speedX = -speedX;
  };

  var _get = function() {
    return { x: x, y: y };
  };
  
  var collide = function(paddle) {
    if (latestHit === paddle) {
      return;
    }
    if (paddle.collides(this)) {
      hitPaddle();
      latestHit = paddle;
    }
  };

  var _update = function () {
    x = lib.limit(x + speedX, 0, WIDTH-BALL_WIDTH);
    y = lib.limit(y + speedY, 0, HEIGHT-BALL_HEIGHT);

    if (y === 0 || y === HEIGHT-BALL_HEIGHT) {
      speedY = -speedY;
    }

    if (x === 0) {
      resetBall();
      callback("left");
    }
    if (x === (WIDTH-BALL_WIDTH)) {
      resetBall();
      callback("right");
    }
  };

  return {
    resetBall: resetBall,
    get: _get,
    update: _update,
    top: top,
    left: left,
    right: right,
    bottom: bottom,
    width: width,
    height: height,
    collide: collide
  };
}
