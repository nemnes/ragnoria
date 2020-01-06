<?php

namespace Server\Requests;

use Server\Classes\Player;
use Server\Classes\SQM;

class Push extends BaseRequest
{
  public function initialize(Player $player, $fromX, $fromY, $fromZ, $toX, $toY, $toZ, $item)
  {
    $itemId = isset($item[0]) ? $item[0] : null;
    $quantity = isset($item[1]) ? $item[1] : null;

    if(!$itemId) {
      return;
    }

    if($fromZ != $toZ) {
      return;
    }
    if($player->Z != $fromZ) {
      return;
    }
    if(!($fromSQM = $this->getWorld()->getSQM($fromX, $fromY, $fromZ))) {
      return;
    }
    if(!($toSQM = $this->getWorld()->getSQM($toX, $toY, $toZ))) {
      return;
    }
    if(!in_array($fromX, [$player->X, $player->X-1, $player->X+1]) || !in_array($fromY, [$player->Y, $player->Y-1, $player->Y+1])) {
      return;
    }
    $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($itemId);
    if(!$structure->IsMoveable) {
      return;
    }
    if($toSQM->isBlockingItems()) {
      return;
    }
    if(!($toSQM->hasFloor())) {
      return;
    }
    /** @var SQM $sqm */
    foreach($this->getWorld()->getSQMsBetween($fromSQM, $toSQM) as $sqm) {
      if($sqm->isBlockingProjectiles()) {
        return;
      }
    }

    // onItemPush Actions
    foreach($toSQM->Items as $item) {
      if($action = $this->getApp()->getAction('ItemPushOn', $item[0])) {
        $action->run($player, $item[0], $fromSQM, $toSQM);
      }
    }

    // validation pass, we can move item
    if($fromSQM->removeItem($itemId)) {
      $toSQM->addItem($itemId);
    }

    /** @var Player $playerOnArea */
    foreach($this->getWorld()->getPlayersOnArea($fromSQM->X, $fromSQM->Y) as $playerOnArea) {
      $playerOnArea->send('Libs_Board.updateSQM', [$fromSQM->X, $fromSQM->Y, $fromSQM->Z, $fromSQM->Items]);
    }
    foreach($this->getWorld()->getPlayersOnArea($toSQM->X, $toSQM->Y) as $playerOnArea) {
      $playerOnArea->send('Libs_Board.updateSQM', [$toSQM->X, $toSQM->Y, $toSQM->Z, $toSQM->Items]);
    }

  }
}