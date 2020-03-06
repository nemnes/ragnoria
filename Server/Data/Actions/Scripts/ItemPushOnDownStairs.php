<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;

class ItemPushOnDownStairs extends BaseAction
{
  public function run(Player $player, $itemId, &$fromSQM, &$toSQM)
  {
    $sqmDown = $this->getApp()->getWorld()->getSQM($toSQM->X, $toSQM->Y, $toSQM->Z-1);
    $toSQM = $sqmDown;

    foreach($sqmDown->Items as $item) {
      if(in_array($item[0], ['3179'])) {
        $toSQM = $this->getApp()->getWorld()->getSQM($sqmDown->X-1, $sqmDown->Y, $sqmDown->Z);
        break;
      }
      if(in_array($item[0], ['3003'])) {
        $toSQM = $this->getApp()->getWorld()->getSQM($sqmDown->X+1, $sqmDown->Y, $sqmDown->Z);
        break;
      }
      if(in_array($item[0], ['3180', '3182'])) {
        $toSQM = $this->getApp()->getWorld()->getSQM($sqmDown->X, $sqmDown->Y-1, $sqmDown->Z);
        break;
      }
      if(in_array($item[0], ['3000', '3001', '3002', '3176'])) {
        $toSQM = $this->getApp()->getWorld()->getSQM($sqmDown->X, $sqmDown->Y+1, $sqmDown->Z);
        break;
      }
    }

  }
}