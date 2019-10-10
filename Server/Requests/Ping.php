<?php

namespace Server\Requests;

use Server\Classes\Player;

class Ping extends BaseRequest
{
  public function initialize(Player $player, $requestId)
  {
    $player->send('App.ping', [$requestId]);
  }
}