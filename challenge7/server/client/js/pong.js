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
    function _redrawBlocks(blocks) {
        $("div.block").remove()
        blocks.forEach(function(block){
            if (block.visible) {
                var elem = $('<div class="block"/>');
                elem.css({top: block.y, left: block.x, width: block.width, height: block.height});
                if block.special {
                    elem.css({color: orange})
                }
                $("#game").append(elem);
            }
        });
    };

    function _redrawBalls(balls) {
        $('div.ball').remove()
        balls.forEach(function(ball){
            var elem = $('<div class="ball"/>');
            elem.css({top: ball.y, left: ball.x});
            $("#game").append(elem);
        });
    }

    var left = data.paddle_left;
    var right = data.paddle_right;
    var leftScore = data.score_left;
    var rightScore = data.score_right;

    $("#left").css({top: left.y, left: left.x});
    $("#right").css({top: right.y, left: right.x});
    $('.left-scoreboard').html(leftScore);
    $('.right-scoreboard').html(rightScore);

    _redrawBlocks(data.blocks);
    _redrawBalls(data.balls);

};

$(document).ready(function() {
    waiting = $('#waiting');
    menu = $('#menu');

    $('#singleplayer').on('click', function() {
        socket.emit('newGameMode', 'singleplayer');

        menu.addClass('hide');
        waiting.removeClass('hide');
    });

    $('#multiplayer').on('click', function() {
        socket.emit('newGameMode', 'multiplayer');

        menu.addClass('hide');
        waiting.removeClass('hide');
    });

    socket.on('update', function(data) {
        waiting.addClass('hide');
        game = $('#game');
        if(game.hasClass('hide')) {
          game.removeClass('hide');
        };
        refresh(data);
    });

    Player({name: 'Player1', keyUp: 38, keyDown: 40, socket: socket});
});


