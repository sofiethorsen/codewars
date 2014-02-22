console.log("game start");

var state;

function resetGame (argument) {
  // body...
}

exports.setPlayer = function(socket) {

  resetGame();

  
  // data.id, data.direction
  socket.on('paddleChange', function (data) {
    console.log(data);
  });

};

function updateGame() {
  // body...
}

// Main loop.
setInterval(function() {
  updateGame();
  socket.emit('update', state);
}, 1000);