<?php

namespace Server\Data\Actions\Scripts;

use Server\App;
use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnDownStairs
{
  public function run(App $app, Player $player, $itemId, SQM $sqm, &$levelChanged)
  {
    $player->Y++;
    $player->Z--;
    $player->Direction = 'South';
    $levelChanged = true;
  }
}