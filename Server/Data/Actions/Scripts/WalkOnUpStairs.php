<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnUpStairs extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    $player->Y--;
    $player->Z++;
    $player->Direction = 'North';
  }
}