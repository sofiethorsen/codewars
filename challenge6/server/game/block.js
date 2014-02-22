constants = require('./constants');

module.exports = function (option) {
    var top = option.top;
    var bottom = option.bottom;
    var visable = true;

    return {
        height: function() { return constants.BLOCK_HEIGHT;},
        hide: function() { visable = false },
        visable: function() { return visable; },
        top: function() { return top; },
        bottom: function() { return top + constants.BLOCK_HEIGHT; },
        left: function() { return left; },
        right: function() { return left + constants.BLOCK_WIDTH; },
        width: function() { return constants.BLOCK_WIDTH; },
        height: function() { return constants.BLOCK_HEIGHT; },
        collides: function(object) {
            if (visable == false) 
                return false;
            if (!(this.right() < object.left() ||
                  this.left() > object.right() ||
                  this.bottom() < object.top() ||
                  this.top() > object.bottom())) {
                return true;
            } else {
                return false;
            }
        }

    };
};
