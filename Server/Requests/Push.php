<?php

namespace Server\Requests;

use Server\Classes\Player;
use Server\Classes\SQM;

class Push extends BaseRequest
{
  public function initialize(Player $player, $fromX, $fromY, $fromZ, $toX, $toY, $toZ, $item)
  {
    $itemId = isset($item->Id) ? $item->Id : null;
    $quantity = isset($item->Quantity) ? $item->Quantity : null;

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
      if($action = $this->getApp()->getAction('ItemPushOn', $item->Id)) {
        $action->run($player, $item->Id, $fromSQM, $toSQM);
      }
    }

    // validation pass, we can move item
    if($fromSQM->removeItem($itemId, $quantity)) {
      $toSQM->addItem($itemId, $quantity);
    }

  }
}