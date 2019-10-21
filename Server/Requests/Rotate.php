<?php

namespace Server\Requests;

use Server\Classes\Player;

class Rotate extends BaseRequest
{
  public function initialize(Player $player, $direction)
  {
    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Player.rotate', [$player->Id, $direction]);
    }
  }
}