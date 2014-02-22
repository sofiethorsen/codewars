player = function(options) {
    var NAME = options.name;
    var KEY_UP = options.keyUp;
    var KEY_DOWN = options.keyDown;

    init = function() {
        controls();
    }

    controls = function() {
        document.addEventListener('keydown', function(event) {
            if(event.keyCode == KEY_UP) {
                console.log(NAME + ' pressed Up');
            } else if(event.keyCode == KEY_DOWN) {
                console.log(NAME + ' pressed Down')
            }
        });
    };

    init();
}

Paddle = function(node) {
    return {
        move: function(offset) {
            var o = node.position();
            o.top += offset;
            o.top = Math.max(0, o.top);
            o.top = Math.min(500 - node.height(), o.top);
            node.css(o);
        }
    };
}

$(document).ready(function() {
    var left = Paddle($("#left"));
    left.move(2000);
});

player1 = player({name: 'klas', keyUp: 38, keyDown: 40}); // up/down arrows
player2 = player({name: 'gustaf', keyUp: 65, keyDown: 90}); // a - up, z - down
