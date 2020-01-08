<?php

namespace Server\Requests;

use Server\Classes\Player;

class UseItem extends BaseRequest
{
  public function initialize(Player $player, $X, $Y, $Z)
  {
    if(!in_array($X, [$player->X, $player->X-1, $player->X+1]) || !in_array($Y, [$player->Y, $player->Y-1, $player->Y+1])) {
      return;
    }
    if(!($SQM = $this->getWorld()->getSQM($X, $Y, $Z))) {
      return;
    }
    if(!($item = $SQM->getItemFromTop())) {
      return;
    }

    $itemId = isset($item[0]) ? $item[0] : null;
    $quantity = isset($item[1]) ? $item[1] : null;

    if($action = $this->getApp()->getAction('ItemUse', $item[0])) {
      $action->run($player, $itemId, $SQM);
    }

  }
}