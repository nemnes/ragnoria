<?php
$fromX = $_POST['FromX'];
$fromY = $_POST['FromY'];
$toX = $_POST['ToX'];
$toY = $_POST['ToY'];

if(!file_exists('map/map.json')) {
  echo 'load failed (map not exists)';
  die();
}
$map = file_get_contents('map/map.json');
$map = json_decode($map, true);
if($map === null) {
  echo 'load failed (can not decode map)';
  die();
}

$return = array();
foreach($map as $z => $level) {
  foreach($level as $y => $row) {
    if($y < $fromY || $y > $toY) {
      continue;
    }
    foreach($row as $x => $stack) {
      if($x < $fromX || $x > $toX) {
        continue;
      }
      $return[$z][$y][$x] = $stack;
    }
  }
}
echo json_encode($return);