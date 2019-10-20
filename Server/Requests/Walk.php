<?php

namespace Server\Requests;

use Server\Classes\Player;

class Walk extends BaseRequest
{
  public function initialize(Player $player, $direction)
  {
    if($player->Locks->Movement > microtime(true)) {
      $player->send('Libs_Hero.confirmStep', [false]);
      $this->getApp()->log($player->Name. ' - movement locked');
      return;
    }

    $speed = 25; // in range between 1 to 100
    $player->Locks->Movement = microtime(true) + ((600-($speed*5.5))/1000+0.025);
    $playersOnAreaBeforeStep = $player->getPlayersOnArea();
    $playersStillOnArea = array();

    $stepDone = false;
    if($direction === 'North') {
      $stepDone = $player->goNorth();
    }
    if($direction === 'South') {
      $stepDone = $player->goSouth();
    }
    if($direction === 'East') {
      $stepDone = $player->goEast();
    }
    if($direction === 'West') {
      $stepDone = $player->goWest();
    }

    if($stepDone) {
      $player->send('Libs_Hero.confirmStep', [true, $player->X, $player->Y, $player->getArea(), $player->getPlayersOnArea()]);
      /** @var Player $playerOnArea */
      foreach($player->getPlayersOnArea() as $playerOnArea) {
        $playerOnArea->send('Libs_Player.move', [$player, $direction]);
        $playersStillOnArea[] = $playerOnArea->Id;
      }
      foreach($playersOnAreaBeforeStep as $playerOnArea) {
        if(!in_array($playerOnArea->Id, $playersStillOnArea)) {
          $playerOnArea->send('Libs_Player.remove', [$player->Id]);
        }
      }
      return;
    }

    $player->send('Libs_Hero.confirmStep', [false]);
  }
}