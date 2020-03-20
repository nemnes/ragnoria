<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;

class ItemPushOnUpStairs extends BaseAction
{
  public function run(Player $player, $itemId, &$fromSQM, &$toSQM)
  {
    switch($itemId) {
      case '3179':
        $toSQM = $this->getApp()->getWorld()->getSQM($toSQM->X+1, $toSQM->Y, $toSQM->Z+1);
        break;
      case '3003':
      case '3182':
        $toSQM = $this->getApp()->getWorld()->getSQM($toSQM->X-1, $toSQM->Y, $toSQM->Z+1);
        break;
      case '3180':
        $toSQM = $this->getApp()->getWorld()->getSQM($toSQM->X, $toSQM->Y+1, $toSQM->Z+1);
        break;
      default:
        $toSQM = $this->getApp()->getWorld()->getSQM($toSQM->X, $toSQM->Y-1, $toSQM->Z+1);
        break;
    }
  }
}