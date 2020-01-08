<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class ItemUseDoor extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    if($itemId == '3045') {
      $sqm->updateItem('3045', '3046');
    }
    if($itemId == '3046') {
      $sqm->updateItem('3046', '3045');
    }
    if($itemId == '3047') {
      $sqm->updateItem('3047', '3048');
    }
    if($itemId == '3048') {
      $sqm->updateItem('3048', '3047');
    }
  }
}