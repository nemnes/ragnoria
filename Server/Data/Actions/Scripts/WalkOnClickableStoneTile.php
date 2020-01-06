<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnClickableStoneTile extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    $sqm->updateItem('1017', '1018');
    /** @var Player $playerOnArea */
    foreach($sqm->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Board.updateSQM', [$sqm->X, $sqm->Y, $sqm->Z, $sqm->Items]);
    }
  }
}