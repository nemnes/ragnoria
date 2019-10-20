<?php
if(!isset($_GET['id']) || !is_numeric($_GET['id']) || $_GET['id'] < 0) {
  die();
}
$noGIF = isset($_GET['nogif']);

$id = $_GET['id'];
$itemsImagesPath = __DIR__ . '/../../Data/item/';

if(!$noGIF) {
  if(file_exists($itemsImagesPath.$id.'.gif')) {
    header('Content-Type: image/gif');
    readfile($itemsImagesPath.$id.'.gif');
    die();
  }
}
if(file_exists($itemsImagesPath.$id.'.png')) {
  header('Content-Type: image/png');
  readfile($itemsImagesPath.$id.'.png');
  die();
}