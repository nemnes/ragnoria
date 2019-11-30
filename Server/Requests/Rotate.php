<?php

namespace Server\Requests;

use Server\Classes\Player;

class Rotate extends BaseRequest
{
  public function initialize(Player $player, $direction)
  {
    if(!in_array($direction, ['North','East','South','West','NorthEast','NorthWest','SouthEast','SouthWest'])) {
      $this->getApp()->log($player->Name. ' - trying to rotate on direction: ' .json_encode($direction));
      return;
    }
    $player->Direction = $direction;
    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Player.rotate', [$player->Id, $direction]);
    }
  }
}