<?php

namespace Server\Classes;

class Item
{
  public $Id;
  public $Quantity;
  public $ActionId;

  public function __construct($id, $quantity, $actionId = null)
  {
    $this->Id = $id;
    $this->Quantity = $quantity;
    $this->ActionId = $actionId;
  }

}