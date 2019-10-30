<?php

namespace Server\Requests;

use Server\Classes\Player;

class Say extends BaseRequest
{
  public function initialize(Player $player, $message)
  {
    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea(false) as $playerOnArea) {
      $playerOnArea->send('Libs_Chat.appendMessage', [$message, $player->Name, $player->X, $player->Y]);
    }

  }
}