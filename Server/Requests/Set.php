<?php

namespace Server\Requests;

use Server\Classes\Player;

class Set extends BaseRequest
{
  public function initialize(Player $player, $message)
  {
    if(strtolower($message) === 'night') {
      $player->send('Libs_Board.setNight', []);
    }
    if(strtolower($message) === 'day') {
      $player->send('Libs_Board.setDay', []);
    }
  }
}