<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class ItemUseStreetLamp extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    if($itemId == '4039') {
      $sqm->updateItem('4039', '4040');
    }
    if($itemId == '4040') {
      $sqm->updateItem('4040', '4039');
    }
  }
}