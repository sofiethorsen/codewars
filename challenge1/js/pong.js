Player = function(options) {
    var NAME = options.name;
    var KEY_UP = options.keyUp;
    var KEY_DOWN = options.keyDown;
    var scoreBoard = options.scoreBoard;
    var score = 0;
    var up = false;
    var down = false;

    init = function() {
        controls();
    }

    controls = function() {
        document.addEventListener('keyup', function(event) {
            if(event.keyCode == KEY_UP) {
                up = false;
            } else if(event.keyCode == KEY_DOWN) {
                down = false;
            }
        });
        document.addEventListener('keydown', function(event) {
            if(event.keyCode == KEY_UP) {
                up = true;
            } else if(event.keyCode == KEY_DOWN) {
                down = true;
            }
        });
    };

    _score = function() {
        return score;
    };

    _updateScore = function() {
        score += 1;
        scoreBoard.html(score);
        return score;
    };

    _direction = function() {
        if (up == down) {
            return 0;
        } else if (up) {
            return -1;
        } else {
            return 1;
        }
    };

    init();

    return {
        direction: _direction,
        score: _score,
        updateScore: _updateScore,
        paddle: options.paddle,
    };
};

var Paddle = function(node) {
    return {
        move: function(offset) {
            var o = node.position();
            o.top += offset;
            o.top = Math.max(0, o.top);
            o.top = Math.min(500 - node.height(), o.top);
            node.css(o);
        },
        node: node
    };
};

function updatePlayer(player) {
    if (player.direction() > 0) {
        player.paddle.move(10);
    } else if (player.direction() < 0) {
        player.paddle.move(-10);
    }
}

$(document).ready(function() {
    paddle_left = Paddle($("#left"));
    paddle_right = Paddle($("#right"));

    player1 = Player({name: 'klas', keyUp: 38, keyDown: 40, paddle: paddle_left, scoreBoard: $('.player1')}); // up/down arrows
    player2 = Player({name: 'gustaf', keyUp: 65, keyDown: 90, paddle: paddle_right, scoreBoard: $('.player2')}); // a - up, z - down

    var ball = Ball($("#ball"), function (side) {
        console.log("hit " + side);
    });
   
    window.requestAnimationFrame(function loop(time) {
        updatePlayer(player1);
        updatePlayer(player2);
        ball.update();

        ball.collied(paddle_left);
        ball.collied(paddle_right);

        window.requestAnimationFrame(loop);
    });
});


