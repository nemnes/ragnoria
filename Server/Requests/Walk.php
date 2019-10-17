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

    if($direction === 'North') {
      if($player->goNorth()) {
        $player->send('Libs_Hero.confirmStep', [true, $player->X, $player->Y, $player->getArea()]);
        return;
      }
    }
    if($direction === 'South') {
      if($player->goSouth()) {
        $player->send('Libs_Hero.confirmStep', [true, $player->X, $player->Y, $player->getArea()]);
        return;
      }
    }
    if($direction === 'East') {
      if($player->goEast()) {
        $player->send('Libs_Hero.confirmStep', [true, $player->X, $player->Y, $player->getArea()]);
        return;
      }
    }
    if($direction === 'West') {
      if($player->goWest()) {
        $player->send('Libs_Hero.confirmStep', [true, $player->X, $player->Y, $player->getArea()]);
        return;
      }
    }

    $player->send('Libs_Hero.confirmStep', [false]);
  }
}