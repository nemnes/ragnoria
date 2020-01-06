<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnFireField extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea(false) as $playerOnArea) {
      $playerOnArea->send('Libs_Effect.run', [4, $player->X, $player->Y, $player->Z, true]);
    }
  }
}