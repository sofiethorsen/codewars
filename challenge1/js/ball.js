function Ball(node) {

  var speed = 10;
  var speedX = 13;
  var speedY = 37;
  var x = 200;
  var y = 200;

  var get = function () {
    return { x : x, y : y};
  };

  var hitPaddle = function(direction) {
    speedX = -speedX;
    speedY = speedY + direction;
  };

  var update = function () {
    x = x + speedX;
    y = y + speedY;
  };

  return {
    get : get,
    hitPaddle : hitPaddle,
    update : update
  };
};


var ball = new Ball();

console.log(ball.get());
ball.hitPaddle();
ball.update();
console.log(ball.get());


