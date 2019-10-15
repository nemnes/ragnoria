<?php
if(!isset($_GET['id']) || !is_numeric($_GET['id']) || $_GET['id'] < 0) {
  die();
}
$id = $_GET['id'];
$itemsImagesPath = __DIR__ . '/../../Data/item/';

if(!file_exists($itemsImagesPath.$id.'.png')) {
  die();
}

header('Content-Type: image/png');
readfile($itemsImagesPath.$id.'.png');