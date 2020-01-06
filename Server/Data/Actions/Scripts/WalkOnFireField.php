<?php

namespace Server\Data\Actions\Scripts;

use Server\App;
use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnFireField
{
  public function run(App $app, Player $player, $itemId, SQM $sqm, $levelChanged)
  {
    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea(false) as $playerOnArea) {
      $playerOnArea->send('Libs_Effect.run', [4, $player->X, $player->Y, $player->Z, true]);
    }
  }
}