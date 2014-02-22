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

  var lastHIt = null;

  node.position().top = y;

  var resetPosition = function() {
    x = 500;
    y = 250;
    speedX = random() * 5;
    speedY = random() * 5;
    // Speed should be at least 5
    speedX =+ sign(speedX) * 5;
    speedY =+ sign(speedY) * 5;

    lastHIt = null;
  };

  var hitPaddle = function(direction) {
    speedX *= 1.2;
    speedY *= 1.2;
    speedX = -speedX;
    // speedY = speedY + direction;
  };

  var limit = function(current, min, max) {
    return Math.max(Math.min(current, max), min);
  };

  var collied = function(paddle, type) {
    if (type === lastHIt) {
      return;
    }

    var o = node.overlaps(paddle.node);
    if (o.targets.length > 0) {
      lastHIt = type;

      var middle_ball = node.position().top + node.height() / 2;
      var top_paddle = paddle.node.position().top - node.height() / 2;
      var paddle_height = paddle.node.height() + node.height();

      var intersection = middle_ball - top_paddle;

      var section = Math.round(intersection / (paddle_height / 8));
      var move = (section - 4) / 3;

      speedY = move * Math.abs(speedX);

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
