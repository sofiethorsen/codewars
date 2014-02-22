lib = require('./lib');

var HEIGHT = 520;
var WIDTH = 520;
module.exports = function (options) {
  var BALL_WIDTH = 25;
  var BALL_HEIGHT = 25;

  var callback = options.callback;
  var speedX, speedY, x, y;
  var latestHit = null;

  function resetBall() {
    x = WIDTH/2;
    y = HEIGHT/2;
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

  var GAME_AREA_TOP = 150;
  var GAME_AREA_BOTTOM = 400;
  

  var topLeftLine     = function(x) { return GAME_AREA_TOP    + -3*x; };
  var bottomLeftLine  = function(x) { return GAME_AREA_BOTTOM + 3*x; };
  
  var toprightLine    = function(x) { return GAME_AREA_TOP    + -3*(WIDTH-x); };
  var bottomrightLine = function(x) { return GAME_AREA_BOTTOM + 3*(WIDTH-x); };

    

  var _update = function () {
    x += speedX;
    y += speedY;

    var ball_mid_x = x + this.width()/2;
    var ball_mid_y = y + this.height()/2;

    var half = WIDTH/2;

    // Left half
    if (ball_mid_x < half) {
      var yTop = topLeftLine(ball_mid_x);
      if (ball_mid_y < yTop) {
        speedX = 0
        speedY = 0
        console.log("collides topLeftLine");
      }
      var yBot = bottomLeftLine(ball_mid_x);
      if (ball_mid_y > yBot) {
        speedX = 0
        speedY = 0
        console.log("collides bottomLeftLine");
      }
    }
    // Right half
    else {
      var yTop = toprightLine(ball_mid_x);
      if (ball_mid_y < yTop) {
        speedX = 0
        speedY = 0
        console.log("collides toprightLine");
      }
      var yBot = bottomrightLine(ball_mid_x);
      if (ball_mid_y > yBot) {
        speedX = 0
        speedY = 0
        console.log("collides bottomrightLine");
      }
    }


    // if (y === 0 || y === HEIGHT-BALL_HEIGHT) {
    //   speedY = -speedY;


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
