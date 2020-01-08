<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnMagicForceField extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    if($sqm->getPos() == [114, 59, 0]) {
      $targetSQM = $this->getApp()->getWorld()->getSQM(20,17,0);
      $player->teleport($targetSQM);
      return;
    }

    if($sqm->getPos() == [19, 17, 0]) {
      $targetSQM = $this->getApp()->getWorld()->getSQM(114,60,0);
      $player->teleport($targetSQM);
      return;
    }
  }
}