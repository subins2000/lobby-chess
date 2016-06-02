<?php
$this->addStyle("chessboard.css");
$this->addScript("chessboard.js");

$this->addStyle("chess.css");
$this->addStyle("online.css");
$this->addScript("chess.js");

$this->addScript("online.js");
?>
<div class="contents">
  <h2>Online</h2>
  <div id="won">
    <?php
    echo sss("You Won!", "You just beat your own computer");
    ?>
  </div>
  <div id="connection">
    <a class="btn green" id="connect">Connect</a>
  </div>
  <div id="game">
    <div id="board"></div>
    <p>Status: <span id="status"></span></p>
  </div>
</div>
