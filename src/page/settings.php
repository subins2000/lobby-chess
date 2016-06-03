<div class="contents">
  <h2>Online Settings</h2>
  <?php
  $username = Request::get("username");
  if($username !== null && csrf()){
    saveData("username", $username);
    echo sss("Saved", "Settings have been saved");
  }
  ?>
  <form method="POST" action="<?php echo \Lobby::u();?>">
    <label>
      <p>Username to publicly display</p>
      <input type="text" name="username" placeholder="Username" />
    </label>
    <?php csrf("i");?>
    <button class="btn green">Save</button>
  </form>
</div>
