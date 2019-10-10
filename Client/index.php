<?php
session_start();
?>
<head>
  <title>Ragnoria</title>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" type="text/css" href="App.css">
  <script src="assets/jquery/jquery-3.4.1.js"></script>
  <script src="assets/jquery/jquery-ui-1.12.1.js"></script>
</head>
<body>

<div id="map"></div>
<div id="ping"></div>

<script src="config.js"></script>
<script src="App.js"></script>
<script src="Libs/Player.js"></script>
<script>
  window.onload = function () {
    App.run();
  }
</script>
</body>