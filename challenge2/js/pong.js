unixTime = function() {
    return Math.round(new Date().getTime());
};

Bot = function (options) {
    var paddle = options.paddle;
    var ball = options.ball;
    var max_move = 50;
    var latest_move_at = unixTime();


    _move = function() {
        if (unixTime() - latest_move_at < 333) {
            return; //yield
        }

        var paddle_mid = paddle.node.position().top + paddle.node.height()/2;
        var ball_mid = ball.node.position().top + ball.node.height()/2;
        var move = paddle_mid-ball_mid;

        move = Math.max(Math.min(move, -max_move), max_move);

        paddle.move(move);


        latest_move_at = unixTime();
    };


}

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
        name: NAME,
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

function haveWinner() {
    var winScore = 10;
    var winner = false;
    var message = $('#message');

    if(player1.score() == winScore) {
        message.removeClass('hide');
        message.html(player1.name.toUpperCase() + ' WINS!');
        return true;
    } else if(player2.score() == winScore) {
        message.removeClass('hide');
        message.html(player2.name.toUpperCase() + ' WINS!');
        return true;
    };

    return winner;
}

$(document).ready(function() {
    paddle_left = Paddle($("#left"));
    paddle_right = Paddle($("#right"));

    player1 = Player({name: 'Player 1', keyUp: 38, keyDown: 40, paddle: paddle_right, scoreBoard: $('.player1')}); // a - up, z - down
    player2 = Player({name: 'Player 2', keyUp: 65, keyDown: 90, paddle: paddle_left, scoreBoard: $('.player2')}); // up/down arrows

    var ball = Ball($("#ball"), function (side) {
        if(side == 'left') {
            player2.updateScore();
        } else if(side == 'right') {
            player1.updateScore();
        };
    });

    bot = Bot({paddle : paddle_right, ball : ball});

    window.requestAnimationFrame(function loop(time) {
        if(!haveWinner()) {
            updatePlayer(player1);
            updatePlayer(player2);
            ball.update();

            ball.collied(paddle_left, "left");
            ball.collied(paddle_right, "right");
        };

        window.requestAnimationFrame(loop);
    });
});


