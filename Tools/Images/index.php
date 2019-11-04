<?php

// ITEM
if(isset($_GET['id'])) {
  $id = $_GET['id'];
  if(!is_numeric($id) || $id < 0) {
    die();
  }
  $noGIF = isset($_GET['nogif']);
  $imagesPath = __DIR__ . '/../../Data/item/';

  if(!$noGIF) {
    if(file_exists($imagesPath.$id.'.gif')) {
      header('Content-Type: image/gif');
      readfile($imagesPath.$id.'.gif');
      die();
    }
  }
  if(file_exists($imagesPath.$id.'.png')) {
    header('Content-Type: image/png');
    readfile($imagesPath.$id.'.png');
    die();
  }
  die();
}


// OUTFIT
if(isset($_GET['outfit'])) {

  include 'OutfitGenerator/Blendmodes.php';
  include 'OutfitGenerator/OutfitGenerator.php';

  $start_time = microtime(true);

  $generator = new OutfitGenerator();

  $outfit = $generator->generate($_GET['outfit']);

  if(isset($_GET['debug'])) {
    unset($generator);
    die((microtime(true) - $start_time));
  }

  header('Content-Type: image/png');
  imagepng($outfit);
  imagedestroy($outfit);
  unset($generator);
  die();
}