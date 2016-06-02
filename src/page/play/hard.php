<?php
$this->addStyle("chessboard.css");
$this->addScript("chessboard.js");

$this->addStyle("chess.css");
$this->addScript("chess.js");

$this->addScript("lozalib.js");
$this->addScript("hard.js");
?>
<div class="contents">
  <div id="won">
    <?php
    echo sss("You Won!", "You just beat your own computer");
    ?>
  </div>
  <div id="board"></div>
  <p>Status: <span id="status"></span></p>
</div>
