<?php

namespace Server\Requests;

use Server\Classes\Player;

class Tp extends BaseRequest
{
  public function initialize(Player $player, $message)
  {
    if(strtolower($message) === 'temple') {
      $player->teleport(173, 47);
    }
    if(strtolower($message) === 'depot') {
      $player->teleport(150, 50);
    }
  }
}