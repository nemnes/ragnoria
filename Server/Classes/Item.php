<?php

namespace Server\Classes;

use Libs\MiscHelper;

class Item extends BaseClass
{
  public $Id;
  public $Name;
  public $Size;
  public $IsBlocking;
  public $IsMoveable;
  public $IsPickupable;
  public $IsAlwaysUnder; // if true z-index will be 0
  public $IsAlwaysTop; // if true z-index will be +1
  public $LightLevel;
  public $LightColor;

  public function initialize($id)
  {
    $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($id);
    MiscHelper::copyObjectProperties($structure, $this);
  }

}