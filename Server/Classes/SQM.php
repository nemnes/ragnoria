<?php

namespace Server\Classes;

class SQM
{
  /** @var Item */
  public $Ground;
  public $Items = array();

  public function __construct(Item $item)
  {
    $this->Ground = $item;
  }

  public function addItem(Item $item)
  {
    $this->Items[] = $item;
  }

  public function removeItem($itemId)
  {
    if(isset(end($this->Items)->Id) && end($this->Items)->Id == $itemId) {
      array_pop($this->Items);
      return true;
    }
    return false;
  }

  public function isWalkable()
  {
    if($this->Ground->IsBlocking) {
      return false;
    }
    /** @var Item $item */
    foreach($this->Items as $item) {
      if($item->IsBlocking) {
        return false;
      }
    }
    return true;
  }

}