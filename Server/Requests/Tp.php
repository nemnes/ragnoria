<?php

namespace Server\Requests;

use Server\Classes\Player;

class Tp extends BaseRequest
{
  public function initialize(Player $player, $message)
  {
    if(strtolower($message) === 'temple') {
      $this->teleport($player, 173, 47);
    }
    if(strtolower($message) === 'depot') {
      $this->teleport($player, 150, 50);
    }
  }

  private function teleport(Player $player, $x, $y) {
    $playersOnAreaBeforeStep = $player->getPlayersOnArea();
    $playersStillOnArea = array();

    $player->X = $x;
    $player->Y = $y;
    $player->Direction = 'South';

    $player->send('Libs_Movement.updatePosition', [true, $player->X, $player->Y, $player->Direction, $player->getArea(), $player->getPlayersOnArea(), $player->getNPCsOnArea()]);
    $player->send('Libs_Effect.run', [1, $player->X, $player->Y]);

    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Player.move', [$player]);
      $playerOnArea->send('Libs_Effect.run', [1, $player->X, $player->Y]);
      $playersStillOnArea[] = $playerOnArea->Id;
    }
    foreach($playersOnAreaBeforeStep as $playerOnArea) {
      if(!in_array($playerOnArea->Id, $playersStillOnArea)) {
        $playerOnArea->send('Libs_Player.remove', [$player->Id]);
      }
    }
  }
}