<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class ItemPushOnMagicForceField extends BaseAction
{
  public function run(Player $player, $itemId, SQM &$fromSQM, SQM &$toSQM)
  {
    if($toSQM->getPos() == [114, 59, 0]) {
      $toSQM = $this->getApp()->getWorld()->getSQM(20, 17, 0);
      return;
    }

    if($toSQM->getPos() == [19, 17, 0]) {
      $toSQM = $this->getApp()->getWorld()->getSQM(114, 60, 0);
      return;
    }
  }
}