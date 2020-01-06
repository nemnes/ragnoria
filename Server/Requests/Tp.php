<?php

namespace Server\Requests;

use Server\Classes\Player;

class Tp extends BaseRequest
{
  public function initialize(Player $player, $message)
  {
    $SQM = false;

    if(strtolower($message) === 'temple') {
      $SQM = $this->getWorld()->getSQM(173, 47, 0);
    }
    if(strtolower($message) === 'depot') {
      $SQM = $this->getWorld()->getSQM(150, 50, 0);
    }
    if(strtolower($message) === 'up') {
      $SQM = $this->getWorld()->getSQM($player->X, $player->Y, $player->Z+1);
    }
    if(strtolower($message) === 'down') {
      $SQM = $this->getWorld()->getSQM($player->X, $player->Y, $player->Z-1);
    }
    if(is_numeric(strtolower($message)) && (int) strtolower($message) == strtolower($message) && (int) strtolower($message) <= 9 && (int) strtolower($message) > 0) {
      $range = (int) strtolower($message);
      switch($player->Direction) {
        case 'South':
          $SQM = $this->getWorld()->getSQM($player->X, $player->Y+$range, $player->Z);
          break;
        case 'East':
          $SQM = $this->getWorld()->getSQM($player->X+$range, $player->Y, $player->Z);
          break;
        case 'North':
          $SQM = $this->getWorld()->getSQM($player->X, $player->Y-$range, $player->Z);
          break;
        case 'West':
          $SQM = $this->getWorld()->getSQM($player->X-$range, $player->Y, $player->Z);
          break;
      }
    }

    if($SQM && $SQM->hasFloor()) {
      $player->teleport($SQM);
    }
  }
}