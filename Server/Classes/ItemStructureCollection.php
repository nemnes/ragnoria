<?php

namespace Server\Classes;

class ItemStructureCollection extends BaseClass
{
  private $ItemStructures = array();

  public function initialize()
  {
    $tblItem = $this->getSQLMapper('tblItem');
    foreach($tblItem->find(array()) as $row) {
      $structure = new \stdClass();
      $structure->Id = $row->Id;
      $structure->Size = $row->Size;
      $structure->Name = $row->Name;
      $structure->IsBlocking = $row->IsBlocking;
      $structure->IsBlockingItems = $row->IsBlockingItems;
      $structure->IsBlockingProjectiles = $row->IsBlockingProjectiles;
      $structure->IsMoveable = $row->IsMoveable;
      $structure->IsPickupable = $row->IsPickupable;
      $structure->IsAlwaysUnder = $row->IsAlwaysUnder;
      $structure->IsAlwaysTop = $row->IsAlwaysTop;
      $structure->LightLevel = $row->LightLevel;
      $structure->LightColor = $row->LightColor;
      $this->ItemStructures[$structure->Id] = $structure;
    }
  }

  public function getItemStructure($id)
  {
    if(isset($this->ItemStructures[$id])) {
      return $this->ItemStructures[$id];
    }
    return false;
  }

}