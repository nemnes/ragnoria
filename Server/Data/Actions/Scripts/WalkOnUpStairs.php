<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnUpStairs extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    switch($itemId) {
      case '3179':
        $targetSQM = $this->getApp()->getWorld()->getSQM($player->X+1, $player->Y, $player->Z+1);
        $direction = 'East';
        break;
      case '3003':
      case '3182':
        $targetSQM = $this->getApp()->getWorld()->getSQM($player->X-1, $player->Y, $player->Z+1);
        $direction = 'West';
        break;
      case '3180':
        $targetSQM = $this->getApp()->getWorld()->getSQM($player->X, $player->Y+1, $player->Z+1);
        $direction = 'South';
        break;
      default:
        $targetSQM = $this->getApp()->getWorld()->getSQM($player->X, $player->Y-1, $player->Z+1);
        $direction = 'North';
        break;
    }

    $player->move($targetSQM, $direction);
  }
}