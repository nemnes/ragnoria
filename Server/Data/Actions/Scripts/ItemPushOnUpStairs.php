<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;

class ItemPushOnUpStairs extends BaseAction
{
  public function run(Player $player, $itemId, &$fromSQM, &$toSQM)
  {
    $toSQM = $this->getApp()->getWorld()->getSQM($toSQM->X, $toSQM->Y-1, $toSQM->Z+1);
  }
}