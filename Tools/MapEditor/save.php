<?php
$area = @json_decode($_POST['Area'], true);
if($area === null) {
  echo 'save failed (can not decode area)';
  die();
}
if(!file_exists('map/map.json')) {
  echo 'save failed (map not exists)';
  die();
}
$map = file_get_contents('map/map.json');
$map = json_decode($map, true);
if($map === null) {
  echo 'save failed (can not decode map)';
  die();
}

foreach($area as $z => $level) {
  foreach($level as $y => $row) {
    foreach($row as $x => $stack) {
      if(isset($map[$z][$y][$x])) {
        unset($map[$z][$y][$x]);
        if(empty($map[$z][$y])) {
          unset($map[$z][$y]);
        }
        if(empty($map[$z])) {
          unset($map[$z]);
        }
      }
    }
  }
}

foreach($area as $z => $level) {
  foreach($level as $y => $row) {
    foreach($row as $x => $stack) {
      if(!empty($stack)) {
        $map[$z][$y][$x] = $stack;
      }
    }
  }
}

$fp = fopen('map/map.json', 'w');
fwrite($fp, json_encode($map));
fclose($fp);

$copyPath = 'map/versions/' .date('Y_m_d');
if (!file_exists($copyPath)) {
  mkdir($copyPath, 0777, true);
}
copy('map/map.json', $copyPath . '/' . date('H_i_s'). '.json');

echo 'saved successfully';
