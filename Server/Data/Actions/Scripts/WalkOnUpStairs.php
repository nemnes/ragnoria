<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnUpStairs extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    $targetSQM = $this->getApp()->getWorld()->getSQM($player->X, $player->Y-1, $player->Z+1);
    $player->move($targetSQM, 'North');
  }
}