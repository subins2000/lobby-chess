$.extend(lobby.app, {
  
  username: null,
  game: new Chess(),
  statusElem: $('#workspace #status'),
  
  connect: function(){
    $("#workspace #connect").addClass("disabled").text("Connected !");
    
    // Make the function wait until the connection is made...
    var waitForSocketConnection = function(socket, callback){
      setTimeout(function () {
        if (socket.readyState === 1) {
          if(callback != null){
            callback();
          }
          return;
        }else {
          waitForSocketConnection(socket, callback);
        }
      }, 5); // wait 5 milisecond for the connection...
    }
    
    // wss://ws-subins.rhcloud.com:8443
    ws = new WebSocket("ws://demos.sim:8000/?service=chess");
    ws.onmessage = function(e){
      msg = JSON.parse(e.data);
      if(msg.type === "playersCount"){
        $("#workspace #status").text(msg.data + " Players Online");
        if(msg.data === "0")
          $("#workspace #status").append("<br/>Sorry, nobody is online to play");
      }
    };
    ws.onerror = function(){
      $("#workspace #connect").removeClass("disabled").text("Connect");
    };
    
    waitForSocketConnection(ws, function(){
      $("#workspace #game").show();
      
      ws.send("register-" + lobby.app.username);
      ws.send("playersCount");
      
      // do not pick up pieces if the game is over
      // only pick up pieces for White
      var onDragStart = function(source, piece, position, orientation) {
        if (game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1) {
          return false;
        }
      };
      
      var onDrop = function(source, target) {
        // see if the move is legal
        var move = game.move({
          from: source,
          to: target,
          promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
      
        // illegal move
        if (move === null) return 'snapback';
        
        updateStatus();
      };
      
      // update the board position after the piece snap
      // for castling, en passant, pawn promotion
      var onSnapEnd = function() {
        board.position(game.fen());
      };
      
      /**
      var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: "<?APP_SRC?>/src/image/pieces/{piece}.png"
      };
      board = ChessBoard('board', cfg);
      */
    });
  },
  
  updateStatus: function() {
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
  
    this.statusElem.html(status);
  },
  
  events: function(){
    // Events
    $("#workspace #connect").live("click", function(){
      connect();
    });
  }
});
lobby.load(function(){
  lobby.app.connect();
});
