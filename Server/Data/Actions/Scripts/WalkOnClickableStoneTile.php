<?php

namespace Server\Data\Actions\Scripts;

use Server\App;
use Server\Classes\Player;
use Server\Classes\SQM;

class WalkOnClickableStoneTile
{
  public function run(App $app, Player $player, $itemId, SQM $sqm, &$levelChanged)
  {
    $sqm->updateItem('1017', '1018');
    /** @var Player $playerOnArea */
    foreach($sqm->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Board.updateSQM', [$sqm->X, $sqm->Y, $sqm->Z, $sqm->Items]);
    }
  }
}