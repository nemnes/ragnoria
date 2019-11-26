<?php

namespace Server\Classes;

class SQM extends BaseClass
{
  public $Items = array();

  public function initialize()
  {
  }

  public function addItem($item)
  {
    $this->Items[] = $item;
  }

  public function removeItem($itemId)
  {
    if(!empty($this->Items) && end($this->Items) == $itemId) {
      array_pop($this->Items);
      return true;
    }
    return false;
  }

  public function isWalkable()
  {
    foreach($this->Items as $item) {
      $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($item);
      if($structure->IsBlocking) {
        return false;
      }
    }
    return true;
  }

}