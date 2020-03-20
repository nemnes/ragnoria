<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class ItemUseFood extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    if($itemId == '7105') {
      $sqm->removeItem('7105', 1);
    }
  }
}