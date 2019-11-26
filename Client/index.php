<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Ragnoria</title>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>

  <link rel="stylesheet" type="text/css" href="assets/App.css">
  <link rel="stylesheet" type="text/css" href="Libs/Console/Console.css">
  <link rel="stylesheet" type="text/css" href="Libs/Ping/Ping.css">
  <link rel="stylesheet" type="text/css" href="Libs/Board/Board.css">
  <link rel="stylesheet" type="text/css" href="Libs/Effect/Effect.css">
  <link rel="stylesheet" type="text/css" href="Libs/Chat/Chat.css">
  <link rel="stylesheet" type="text/css" href="Libs/Outfiter/Outfiter.css">

  <script src="assets/jquery/jquery-3.4.1.js"></script>
  <script src="assets/jquery/jquery-ui-1.12.1.js"></script>
  <script src="assets/keyboardjs/KeyboardJS.js"></script>
</head>
<body>
  <script src="config.js"></script>
  <script src="App.js"></script>
  <script src="Libs/Misc/Misc.js"></script>
  <script src="Libs/Console/Console.js"></script>
  <script src="Libs/Ping/Ping.js"></script>
  <script src="Libs/Board/Board.js"></script>
  <script src="Libs/Item/Item.js"></script>
  <script src="Libs/Hero/Hero.js"></script>
  <script src="Libs/Player/Player.js"></script>
  <script src="Libs/NPC/NPC.js"></script>
  <script src="Libs/Mouse/Mouse.js"></script>
  <script src="Libs/Keyboard/Keyboard.js"></script>
  <script src="Libs/Movement/Movement.js"></script>
  <script src="Libs/Effect/Effect.js"></script>
  <script src="Libs/Chat/Chat.js"></script>
  <script src="Libs/Outfiter/Outfiter.js"></script>
  <script>
    window.onload = function () {
      App.run();
    }
  </script>
</body>
</html>