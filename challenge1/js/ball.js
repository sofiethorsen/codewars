function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function random() {
  return (Math.random() - 0.5) * 2;
}

function Ball(node, paddleHitCallback) {

  var speedX = random() * 5;
  var speedY = random() * 5;
  // Speed should be at least 5
  speedX =+ sign(speedX) * 5;
  speedY =+ sign(speedY) * 5;

  var x = node.position().left;
  var y = 100 + Math.random() * 300;

  node.position().top = y;

  var resetPosition = function() {
    x = 500;
    y = 250;
  };

  var hitPaddle = function(direction) {
    speedX = -speedX;
    // speedY = speedY + direction;
  };

  var limit = function(current, min, max) {
    return Math.max(Math.min(current, max), min);
  };

  var collied = function(paddle) {
    var o = node.overlaps(paddle.node);
    if (o.targets.length > 0) {

      var top_ball = node.position().top;
      var top_paddle = paddle.node.position().top + node.height();

      // var top = top_paddle ;



      // var bottom = top_paddle - paddle.node.height();



      



      var diff = top_paddle-top_ball;

      console.log("DIFF", top_paddle, top_ball, diff)



      hitPaddle();
      update();

    }
  };

  var update = function () {
    x = limit(x + speedX, 0, 1000-node.width());
    y = limit(y + speedY, 0, 500-node.height());

    if (y === 0 || y === 500-node.height()) {
      speedY = -speedY;
    }

    if (x === 0) {
      paddleHitCallback("left");
      resetPosition();
    }
    if (x === (1000-node.width())) {
      paddleHitCallback("right");
      resetPosition();
    }

    node.css({top: y, left: x}); //Update the nodes position
  };

  return {
    update : update,
    collied : collied
  };
};
