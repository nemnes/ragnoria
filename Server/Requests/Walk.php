<?php

namespace Server\Requests;

use Server\Classes\Player;

class Walk extends BaseRequest
{
  public function initialize(Player $player, $direction)
  {
    if($player->Locks->Movement > microtime(true)) {
      $this->getApp()->log($player->Name. ' - movement locked');
      return;
    }

    $speed = 20;
    $player->Locks->Movement = microtime(true) + ((600-($speed*5.5))/1000+0.025);

    if($direction === 'North') {
      if($player->goNorth()) {
        $player->send('App.MyPlayer.goNorth', [$player->getArea(),$speed]);
      }
    }
    if($direction === 'South') {
      if($player->goSouth()) {
        $player->send('App.MyPlayer.goSouth', [$player->getArea(),$speed]);
      }
    }
    if($direction === 'East') {
      if($player->goEast()) {
        $player->send('App.MyPlayer.goEast', [$player->getArea(),$speed]);
      }
    }
    if($direction === 'West') {
      if($player->goWest()) {
        $player->send('App.MyPlayer.goWest', [$player->getArea(),$speed]);
      }
    }

  }
}