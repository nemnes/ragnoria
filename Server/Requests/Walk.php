<?php

namespace Server\Requests;

use Server\Classes\Player;

class Walk extends BaseRequest
{
  public function initialize(Player $player, $direction)
  {
    if($player->Locks->Movement > microtime(true)) {
      $player->send('Libs_Movement.confirmStep', [false, $player->X, $player->Y, $player->Direction]);
//      $this->getApp()->log($player->Name. ' - movement locked');
      return;
    }

    $player->Locks->Movement = microtime(true) + ((600-($player->Speed*5.5))/1000);
    $playersOnAreaBeforeStep = $player->getPlayersOnArea();
    $playersStillOnArea = array();

    $stepDone = false;
    if($direction === 'North') {
      $stepDone = $player->goNorth();
    }
    if($direction === 'NorthEast') {
      $stepDone = $player->goNorthEast();
    }
    if($direction === 'East') {
      $stepDone = $player->goEast();
    }
    if($direction === 'SouthEast') {
      $stepDone = $player->goSouthEast();
    }
    if($direction === 'South') {
      $stepDone = $player->goSouth();
    }
    if($direction === 'SouthWest') {
      $stepDone = $player->goSouthWest();
    }
    if($direction === 'West') {
      $stepDone = $player->goWest();
    }
    if($direction === 'NorthWest') {
      $stepDone = $player->goNorthWest();
    }

    if($stepDone) {
      $player->send('Libs_Movement.confirmStep', [true, $player->X, $player->Y, $player->Direction, $player->getArea(), $player->getPlayersOnArea(), $player->getNPCsOnArea()]);
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

      // interaction with sqm items on walk
      foreach($this->getWorld()->getSQM($player->X, $player->Y)->Items as $item) {
        if($item[0] === 4029) {
          $player->send('Libs_Effect.run', [4, $player->X, $player->Y, 6]);
        }
      }

      return;
    }

    $player->send('Libs_Movement.confirmStep', [false, $player->X, $player->Y, $player->Direction]);
  }
}