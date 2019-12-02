<?php

namespace Server\Classes;

class SQM extends BaseClass
{
  public $Items = array();

  public function initialize()
  {
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

}