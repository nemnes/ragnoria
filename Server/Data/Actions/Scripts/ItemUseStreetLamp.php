<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class ItemUseStreetLamp extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    if($itemId == '5066') {
      $sqm->updateItem('5066', '5067');
    }
    if($itemId == '5067') {
      $sqm->updateItem('5067', '5066');
    }
  }
}