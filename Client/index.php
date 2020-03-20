<?php
$v = '1.02';
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Ragnoria</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>

  <link rel="stylesheet" type="text/css" href="assets/App.css<?= '?'.$v; ?>">
  <link rel="stylesheet" type="text/css" href="Libs/Console/Console.css<?= '?'.$v; ?>">
  <link rel="stylesheet" type="text/css" href="Libs/UI/UI.css<?= '?'.$v; ?>">
  <link rel="stylesheet" type="text/css" href="Libs/Board/Board.css<?= '?'.$v; ?>">
  <link rel="stylesheet" type="text/css" href="Libs/Chat/Chat.css<?= '?'.$v; ?>">
  <link rel="stylesheet" type="text/css" href="Libs/Outfiter/Outfiter.css<?= '?'.$v; ?>">

  <script src="assets/jquery/jquery-3.4.1.js"></script>
<!--  <script src="assets/jquery/jquery-ui-1.12.1.js"></script>-->
  <script src="assets/keyboardjs/KeyboardJS.js"></script>
</head>
<body>
  <script src="config.js<?= '?'.$v; ?>"></script>
  <script src="App.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Misc/Misc.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Loader/Loader.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Console/Console.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Renderer/Renderer.js<?= '?'.$v; ?>"></script>
  <script src="Libs/UI/UI.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Board/Board.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Item/Item.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Hero/Hero.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Player/Player.js<?= '?'.$v; ?>"></script>
  <script src="Libs/NPC/NPC.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Mouse/Mouse.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Keyboard/Keyboard.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Movement/Movement.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Effect/Effect.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Chat/Chat.js<?= '?'.$v; ?>"></script>
  <script src="Libs/Outfiter/Outfiter.js<?= '?'.$v; ?>"></script>
  <script>
    window.onload = function () {
      App.run();
    }
  </script>
</body>
</html>