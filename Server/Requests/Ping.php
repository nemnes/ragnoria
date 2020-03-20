<?php

namespace Server\Requests;

use Server\Classes\Player;

class Ping extends BaseRequest
{
  public function initialize(Player $player, $requestId)
  {
    $player->send('Libs_UI.Ping.pull', [$requestId]);
  }
}