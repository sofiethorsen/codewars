function Ball(node, paddleHitCallback) {

  var speedX = 7;
  var speedY = 7;
  var x = node.position().left;
  var y = node.position().top;

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
      hitPaddle();
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
