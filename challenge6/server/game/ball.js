lib = require('./lib');
constants = require('./constants');

module.exports = function (options) {
  var callback = options.callback;
  var speedX, speedY, x, y;
  var latestHit = null;
  var latestLineHit = null;

  function resetBall() {
    x = constants.WIDTH/2;
    y = constants.HEIGHT/2;
    speedX = lib.random() * 5;
    speedY = lib.random() * 5;
    // Speed should be at least 5
    speedX =+ lib.sign(speedX) * 5;
    speedY =+ lib.sign(speedY) * 5;
    latestHit = null;
    latestLineHit = null;

  };
  resetBall();

  var top     = function()    { return y;};
  var bottom  = function()    { return y+constants.BALL_HEIGHT;};
  var left    = function()    { return x;};
  var right   = function()    { return x+constants.BALL_WIDTH;};
  var width   = function()    { return constants.BALL_WIDTH;};
  var height   = function()    { return constants.BALL_HEIGHT;};

  var hitPaddle = function() {
    speedX *= 1.2;
    speedY *= 1.2;
    speedX = -speedX;
  };

  var hitBlock = function() {
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

  var topLeftLine     = function(x) { return GAME_AREA_TOP    + -(0.577)*x; };
  var bottomLeftLine  = function(x) { return GAME_AREA_BOTTOM + (0.577)*x; };
  var toprightLine    = function(x) { return GAME_AREA_TOP    + -(0.577)*(constants.WIDTH-x); };
  var bottomrightLine = function(x) { return GAME_AREA_BOTTOM + (0.577)*(constants.WIDTH-x); };

  var length = function(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  };

  var degree = function(x, y) {
    return Math.atan(y / x);
  };

  var vector = function (degree, length) {
    return {
      x : Math.cos(degree)*length,
      y : Math.sin(degree)*length
    }
  }

  var toRad = function(degrees) {
    return degrees * (Math.PI/180);
  }

  var _update = function () {
    x += speedX;
    y += speedY;

    var incoming = degree(speedX, speedY);
    var l = length(speedX, speedY);

    //v = vector(d, l);

    //console.log(x, y, v);

    var ball_mid_x = x + this.width()/2;
    var ball_mid_y = y + this.height()/2;

    var half = constants.WIDTH/2;

    // Left half
    if (ball_mid_x < half) {
      var yTop = topLeftLine(ball_mid_x);
      if (ball_mid_y < yTop && latestLineHit !== "topLeftLine") {
        //speedY *= -1;
        var outDeg = 2 * toRad(150) - toRad(180) - incoming;
        var out = vector(outDeg, l);
        speedX = out.x;
        speedY = out.y;

        if (speedY < 0) {
          speedY = -speedY;
          speedX = -speedX;
        }

        latestLineHit = "topLeftLine";
        console.log("collides topLeftLine");
      }
      var yBot = bottomLeftLine(ball_mid_x);
      if (ball_mid_y > yBot && latestLineHit !== "bottomLeftLine") {
        var outDeg = 2 * toRad(30) - toRad(180) - incoming;
        var out = vector(outDeg, l);
        speedX = out.x;
        speedY = out.y;

        if (speedY > 0) {
          speedY = -speedY;
          speedX = -speedX;
        }

        latestLineHit = "bottomLeftLine";
        console.log("collides bottomLeftLine");
      }
    }
    // Right half
    else {
      var yTop = toprightLine(ball_mid_x);
      if (ball_mid_y < yTop && latestLineHit !== "toprightLine") {
        var outDeg = 2 * toRad(210) - toRad(180) - incoming;
        var out = vector(outDeg, l);
        speedX = out.x;
        speedY = out.y;

        if (speedY < 0) {
          speedY = -speedY;
          speedX = -speedX;
        }

        latestLineHit = "toprightLine";
        console.log("collides toprightLine");
      }
      var yBot = bottomrightLine(ball_mid_x);
      if (ball_mid_y > yBot && latestLineHit !== "bottomrightLine") {
        var outDeg = 2 * toRad(330) - toRad(180) - incoming;
        var out = vector(outDeg, l);
        speedX = out.x;
        speedY = out.y;

        if (speedY > 0) {
          speedY = -speedY;
          speedX = -speedX;
        }

        latestLineHit = "bottomrightLine";
        console.log("collides bottomrightLine");
      }
    }


    // if (y === 0 || y === HEIGHT-constants.BALL_HEIGHT) {
    //   speedY = -speedY;


    if (x < 0) {
      resetBall();
      callback("left");
    }
    if (x > (constants.WIDTH-this.width())) {
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
    collide: collide,
    hitBlock: hitBlock
  };
}
