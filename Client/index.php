<?php
session_start();
?>
<head>
  <title>Ragnoria</title>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" type="text/css" href="assets/App.css">

  <link rel="stylesheet" type="text/css" href="Libs/Console/Console.css">
  <link rel="stylesheet" type="text/css" href="Libs/Ping/Ping.css">
  <script src="assets/jquery/jquery-3.4.1.js"></script>
  <script src="assets/jquery/jquery-ui-1.12.1.js"></script>
  <script src="assets/keyboardjs/KeyboardJS.js"></script>
</head>
<body>

<div id="map"></div>

<script src="config.js"></script>
<script src="App.js"></script>
<script src="Libs/Player.js"></script>

<script src="Libs/Board/Board.js"></script>
<script src="Libs/Console/Console.js"></script>
<script src="Libs/Ping/Ping.js"></script>
<script src="Libs/Keyboard/Keyboard.js"></script>
<script src="Libs/Mouse/Mouse.js"></script>
<script src="Libs/Misc/Misc.js"></script>
<script>
  window.onload = function () {
    App.run();
  }
</script>
<script>
</script>
</body>