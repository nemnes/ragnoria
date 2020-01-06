<?php

namespace Server\Requests;

use Server\Classes\Player;

class Walk extends BaseRequest
{
  public function initialize(Player $player, $direction)
  {
    if($player->Locks->Movement > microtime(true)) {
      $player->send('Libs_Movement.confirmStep', [false, $player->X, $player->Y, $player->Z, $player->Direction]);
//      $this->getApp()->log($player->Name. ' - movement locked');
      return;
    }

    $player->Locks->Movement = microtime(true) + ((600-($player->Speed*5.5))/1000);
    $playersOnAreaBeforeStep = $player->getPlayersOnArea();
    $playersStillOnArea = array();

    $sqmFrom = $this->getWorld()->getSQM($player->X, $player->Y, $player->Z);
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
    $sqmTo = $this->getWorld()->getSQM($player->X, $player->Y, $player->Z);

    if($stepDone) {

      $this->getWorld()->getSQM($sqmFrom->X, $sqmFrom->Y, $sqmFrom->Z)->walkOut($player);
      $this->getWorld()->getSQM($sqmTo->X, $sqmTo->Y, $sqmTo->Z)->walkOn($player);

      /** @var Player $playerOnArea */
      foreach($player->getPlayersOnArea() as $playerOnArea) {
        if($sqmFrom->Z == $player->Z) {
          $playerOnArea->send('Libs_Player.move', [$player, $direction]);
        }
        else {
          $playerOnArea->send('Libs_Player.move', [$player]);
        }
        $playersStillOnArea[] = $playerOnArea->Id;
      }
      foreach($playersOnAreaBeforeStep as $playerOnArea) {
        if(!in_array($playerOnArea->Id, $playersStillOnArea)) {
          $playerOnArea->send('Libs_Player.remove', [$player->Id]);
        }
      }
      $player->send('Libs_Movement.confirmStep', [true, $player->X, $player->Y, $player->Z, $player->Direction, $player->getArea(), $player->getPlayersOnArea(), $player->getNPCsOnArea()]);
      return;
    }

    $player->send('Libs_Movement.confirmStep', [false, $player->X, $player->Y, $player->Z, $player->Direction]);
  }
}