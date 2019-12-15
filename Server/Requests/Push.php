<?php

namespace Server\Requests;

use Server\Classes\Player;

class Push extends BaseRequest
{
  public function initialize(Player $player, $fromX, $fromY, $toX, $toY, $item)
  {
    $itemId = isset($item[0]) ? $item[0] : null;
    $quantity = isset($item[1]) ? $item[1] : null;

    if(!$itemId) {
      return;
    }

    if(!($fromSQM = $this->getWorld()->getSQM($fromX, $fromY))) {
      return;
    }
    if(!($toSQM = $this->getWorld()->getSQM($toX, $toY))) {
      return;
    }
    if(!in_array($fromX, [$player->X, $player->X-1, $player->X+1]) || !in_array($fromY, [$player->Y, $player->Y-1, $player->Y+1])) {
      return;
    }
    if($fromSQM->removeItem($itemId)) {
      $toSQM->addItem($itemId);
    }

    /** @var Player $playerOnArea */
    foreach($this->getWorld()->getPlayersOnArea($fromX, $fromY) as $playerOnArea) {
      $playerOnArea->send('Libs_Board.updateSQM', [$fromX, $fromY, $fromSQM->Items]);
    }
    foreach($this->getWorld()->getPlayersOnArea($toX, $toY) as $playerOnArea) {
      $playerOnArea->send('Libs_Board.updateSQM', [$toX, $toY, $toSQM->Items]);
    }

  }
}