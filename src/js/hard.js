var statusEl = $('#status'), startFrom = 'startpos';

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }
  
  if(game.game_over()){
    // checkmate?
    if (game.in_checkmate() === true) {
      status = 'Game over, ' + moveColor + ' is in checkmate.';
    }else if (game.in_draw() === true) {
      status = 'Game over, drawn position';
    }
  // game still on
  }else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  statusEl.html(status);
};

function lozUpdateBestMove () {

  var move = {};

  move.from = lozData.bmFr;
  move.to   = lozData.bmTo;

  if (lozData.bmPr)
    move.promotion = lozData.bmPr;

  game.move(move);
  board.position(game.fen());

  if (!game.game_over())
    drag = true;
  else
    showEnd();
  updateStatus();
}

var onDrop = function(source, target, piece, newPos, oldPos, orientation) {

  if (target == 'offboard' || target == source) {
    //console.log('offboard');
    return;
  }

  var move = game.move({from: source, to: target, promotion: 'q'})
  if (!move) {
    //console.log('invalid');
    return 'snapback';
  }

  if (move.flags == 'e' || move.flags == 'p' || move.flags == 'k' || move.flags == 'q')
    board.position(game.fen());

  var pgn = game.pgn({newline_char: '<br>'});
  $('#moves').html(pgn);

  drag = false;

  if (!game.game_over()) {
    $("#workspace #status").html('');
    var movetime = 1000;
    engine.postMessage('position ' + startFrom + ' moves ' + strMoves());
    engine.postMessage('go movetime ' + movetime);
  }
  updateStatus();
};


var onDragStart = function(source, piece, position, orientation) {

  if ((orientation === 'white' && piece.search(/^w/) === -1) || (orientation === 'black' && piece.search(/^b/) === -1)) {
    return false;
  }

  return true;
};

function strMoves() {

  var movesStr = '';
  var moves    = game.history({verbose: true});

  for (var i=0; i < moves.length; i++) {
    if (i)
      movesStr += ' ';
    var move = moves[i];
    movesStr += move.from + move.to;
    if (move.promotion)
      movesStr += move.promotion;
  }

  return movesStr;
}

$(function() {

  engine = new Worker("<?APP_SRC?>/src/js/lozza.js");
  engine.onmessage = lozStandardRx;
  
  game = new Chess();
  board = new ChessBoard('board', {
    showNotation : true,
    draggable    : true,
    dropOffBoard : 'snapback',
    onDrop       : onDrop,
    onDragStart  : onDragStart,
    position     : "start",
    pieceTheme   : "<?APP_SRC?>/src/image/pieces/{piece}.png"
  });

  engine.postMessage('uci');
  engine.postMessage('ucinewgame');
  engine.postMessage('debug off');
});
