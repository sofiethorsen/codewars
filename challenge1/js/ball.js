function Ball(node) {


  var speed = 10;
  var speedX = 13;
  var speedY = 37;
  var o = node.position();  
  var x = o.left;
  var y = o.top;

  var get = function () {
    return node.position();
  };

  var hitPaddle = function(direction) {
    speedX = -speedX;
    // speedY = speedY + direction;
  };

  var limit = function(current, min, max) {
    return Math.max(Math.min(current, max), min);
  };

  var update = function () {
    x = limit(x + speedX, 0, 1000-node.width());
    y = limit(y + speedY, 0, 500-node.height());

    if (y === 0) {
      speedY = -speedY
    }
    if (y === 500-node.height()) {
      speedY = -speedY
    }

    if ((x == 0) ||x === (1000-node.width())) {
      hitPaddle(); //TODO: Report thingy
    }

    node.css({top: y, left: x}); //Update the nodes position
  };

  return {
    get : get,
    hitPaddle : hitPaddle,
    update : update
  };
};
