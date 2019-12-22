<?php

namespace Server\Classes;

class SQM extends BaseClass
{
  public $X;
  public $Y;
  public $Items = array();

  public function initialize($x, $y)
  {
    $this->X = $x;
    $this->Y = $y;
  }

  public function addItem($itemId, $quantity = null)
  {
    $this->Items[] = $quantity ? [$itemId, $quantity] : [$itemId];
  }

  public function removeItem($itemId)
  {
    if(!empty($this->Items) && end($this->Items)[0] == $itemId) {
      array_pop($this->Items);
      return true;
    }
    return false;
  }

  public function isWalkable()
  {
    foreach($this->Items as $item) {
      $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($item[0]);
      if($structure->IsBlocking) {
        return false;
      }
    }
    return true;
  }

  public function isBlockingItems()
  {
    foreach($this->Items as $item) {
      $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($item[0]);
      if($structure->IsBlockingItems) {
        return true;
      }
    }
    return false;
  }

  public function isBlockingProjectiles()
  {
    foreach($this->Items as $item) {
      $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($item[0]);
      if($structure->IsBlockingProjectiles) {
        return true;
      }
    }
    return false;
  }

}