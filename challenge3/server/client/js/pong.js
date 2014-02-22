Player = function(options) {
    var NAME = options.name;
    var KEY_UP = options.keyUp;
    var KEY_DOWN = options.keyDown;
    var scoreBoard = options.scoreBoard;
    var score = 0;
    var up = false;
    var down = false;

    init = function() {
        controls(options.socket);
    }

    controls = function(socket) {
        document.addEventListener('keyup', function(event) {
            if(event.keyCode == KEY_UP) {
                socket.emit('paddleMove', {player: NAME, direction: 'none'});
            } else if(event.keyCode == KEY_DOWN) {
                socket.emit('paddleMove', {player: NAME, direction: 'none'});
            }
        });
        document.addEventListener('keydown', function(event) {
            if(event.keyCode == KEY_UP) {
                socket.emit('paddleMove', {player: NAME, direction: 'up'});
            } else if(event.keyCode == KEY_DOWN) {
                socket.emit('paddleMove', {player: NAME, direction: 'down'});
            }
        });
    };

    init();

};

var Paddle = function(node) {
    return {
        move: function(top) {
            var o = node.position();
            o.top = top;
            node.css(o);
        },
        node: node
    };
};

function refresh(data) {
    var ball = data.ball;
    var left = data.paddle_left;
    var right = data.paddle_right;
    var leftScore = data.score_left;
    var rightScore = data.score_right;

    console.log(left);
    $("#ball").css({top: ball.y, left: ball.x});
    $("#left").css({top: left.y, left: left.x});
    $("#right").css({top: right.y, left: right.x});
    $('.left-scoreboard').html(leftScore);
    $('.right-scoreboard').html(rightScore);
};

$(document).ready(function() {
    var socket = io.connect('http://localhost');
    socket.on('update', function(data) {
        refresh(data);
    });

    Player({name: 'Player1', keyUp: 38, keyDown: 40, socket: socket});
});


