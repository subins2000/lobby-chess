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
    <a class="btn red" href="<?php echo $this->u("/settings");?>">Settings</a>
  </div>
  <div id="game">
    <div id="board"></div>
  </div>
  <p>Status: <span id="status"></span></p>
</div>
<script>
  lobby.load(function(){
    lobby.app.username = "<?php echo getData("username");?>";
  });
</script>
