var PADDLE_WIDTH = 20;
var PADDLE_HEIGHT = 50;
var PADDLE_SPEED = 10;

constants = require('./constants');

module.exports = function (side) {
    var top = 0;
    var left = side == "left" ? 0 : constants.WIDTH - PADDLE_WIDTH;
    var direction = 0;

    return {
        height: function() {
            return PADDLE_HEIGHT;
        },
        setDirection: function(dir) {
            if (dir === "up") {
                direction = -1;
            } else if (dir === "down") {
                direction = 1;
            } else {
                direction = 0;
            }
        },
        update: function() {
            top += direction * PADDLE_SPEED;
            top = Math.max(Math.min(constants.GAME_AREA_BOTTOM - this.height(), constants.GAME_AREA_TOP), 0);
        },
        top: function() { return top; },
        bottom: function() { return top + PADDLE_HEIGHT; },
        left: function() { return left; },
        right: function() { return left + PADDLE_WIDTH; },
        width: function() { return PADDLE_WIDTH; },
        height: function() { return PADDLE_HEIGHT; },
        collides: function(ball) {
            if (!(this.right() < ball.left() ||
                  this.left() > ball.right() ||
                  this.bottom() < ball.top() ||
                  this.top() > ball.bottom())) {
                return true;
            } else {
                return false;
            }
        }

    };
};
