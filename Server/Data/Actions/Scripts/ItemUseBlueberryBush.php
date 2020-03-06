<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class ItemUseBlueberryBush extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    $sqm->updateItem('4049', '4048');
    $sqm->addItem('7105', 3);
  }
}