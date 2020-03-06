<?php

use Libs\DBConnector;
use Libs\SQLMapper;
use Server\Settings;

require('../../Libs/DBConnector.php');
require('../../Libs/SQLMapper.php');
require('../../Server/Settings.php');

class SaveItem
{
  public $PDO;
  public $Items = array();

  public function __construct() {
    $this->PDO = new DBConnector(Settings::DATABASE['HOST'], Settings::DATABASE['USERNAME'], Settings::DATABASE['PASSWORD'], Settings::DATABASE['DATABASE']);

    $this->updateItem();
    $this->importItems();
    $this->createFile('items.json', json_encode($this->Items));
  }

  private function getSQLMapper($table, $pk = null)
  {
    return new SQLMapper($this->PDO->getConnection(), $table, $pk);
  }

  private function updateItem()
  {
    $tblItem = $this->getSQLMapper('tblItem', $_POST['Id']);
    $_POST['Sprites'] = json_encode($_POST['Sprites']);
    foreach($_POST as $attr=>$value) {
      $tblItem->{$attr} = $value;
    }
    $tblItem->save();
  }

  private function importItems()
  {
    $tblItem = $this->getSQLMapper('tblItem');
    foreach($tblItem->find(array()) as $row) {
      $item = new stdClass();
      $item->Id = $row->Id;
      $item->ItemTypeId = $row->ItemTypeId;
      $item->Name = $row->Name;
      $item->Size = (int) $row->Size;
      $item->Altitude = (int) $row->Altitude;
      $item->IsAnimating = $row->IsAnimating > 0 ? true : false;
      $item->IsBlocking = $row->IsBlocking > 0 ? true : false;
      $item->IsBlockingProjectiles = $row->IsBlockingProjectiles > 0 ? true : false;
      $item->IsBlockingItems = $row->IsBlockingItems > 0 ? true : false;
      $item->IsMoveable = $row->IsMoveable > 0 ? true : false;
      $item->IsPickupable = $row->IsPickupable > 0 ? true : false;
      $item->IsStackable = $row->IsStackable > 0 ? true : false;
      $item->IsAlwaysTop = $row->IsAlwaysTop > 0 ? true : false;
      $item->LightRadius = (int) $row->LightRadius;
      $item->LightLevel = (int) $row->LightLevel;
      $item->LightColor = $row->LightColor;
      $item->Sprites = $row->Sprites;
      $this->Items[$item->Id] = $item;
    }
  }

  public function createFile($filename, $data)
  {
    $fp = fopen($filename, 'w');
    fwrite($fp, $data);
    fclose($fp);
  }

}

new SaveItem();