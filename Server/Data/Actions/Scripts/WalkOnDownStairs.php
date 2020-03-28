<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnDownStairs extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    $sqmDown = $this->getApp()->getWorld()->getSQM($sqm->X, $sqm->Y, $sqm->Z-1);
    $targetSQM = $this->getApp()->getWorld()->getSQM($player->X, $player->Y, $player->Z-1);
    $direction = $player->Direction;

    foreach($sqmDown->Items as $item) {
      if(in_array($item->Id, ['3179'])) {
        $targetSQM = $this->getApp()->getWorld()->getSQM($player->X-1, $player->Y, $player->Z-1);
        $direction = 'West';
        break;
      }
      if(in_array($item->Id, ['3003', '3182'])) {
        $targetSQM = $this->getApp()->getWorld()->getSQM($player->X+1, $player->Y, $player->Z-1);
        $direction = 'East';
        break;
      }
      if(in_array($item->Id, ['3180'])) {
        $targetSQM = $this->getApp()->getWorld()->getSQM($player->X, $player->Y-1, $player->Z-1);
        $direction = 'North';
        break;
      }
      if(in_array($item->Id, ['3000', '3001', '3002', '3176'])) {
        $targetSQM = $this->getApp()->getWorld()->getSQM($player->X, $player->Y+1, $player->Z-1);
        $direction = 'South';
        break;
      }
    }
    $player->move($targetSQM, $direction);
  }
}