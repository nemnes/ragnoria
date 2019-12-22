<?php

use Libs\DBConnector;
use Libs\SQLMapper;
use Server\Settings;

require('../Libs/DBConnector.php');
require('../Libs/SQLMapper.php');
require('../Server/Settings.php');

class ItemsImporter {
  public $PDO;

  public function __construct() {
    $this->PDO = new DBConnector(Settings::DATABASE['HOST'], Settings::DATABASE['USERNAME'], Settings::DATABASE['PASSWORD'], Settings::DATABASE['DATABASE']);
    $items = $this->import();
    $this->createFile('items.json', json_encode($items));
  }

  public function import()
  {
    $items = array();
    $tblItem = $this->getSQLMapper('tblItem');
    foreach($tblItem->find(array()) as $row) {
      $item = new stdClass();
      $item->Id = $row->Id;
      $item->ItemTypeId = $row->ItemTypeId;
      $item->Name = $row->Name;
      $item->Size = $row->Size;
      $item->Altitude = $row->Altitude;
      $item->IsAnimating = $row->IsAnimating > 0 ? true : false;
      $item->IsBlocking = $row->IsBlocking > 0 ? true : false;
      $item->IsMoveable = $row->IsMoveable > 0 ? true : false;
      $item->IsPickupable = $row->IsPickupable > 0 ? true : false;
      $item->IsStackable = $row->IsStackable > 0 ? true : false;
      $item->IsAlwaysUnder = $row->IsAlwaysUnder > 0 ? true : false;
      $item->IsAlwaysTop = $row->IsAlwaysTop > 0 ? true : false;
      $item->LightSize = $row->LightSize;
      $item->LightLevel = $row->LightLevel;
      $item->LightColor = $row->LightColor;
      $items[$item->Id] = $item;
    }
    return $items;
  }

  public function createFile($filename, $data)
  {
    $fp = fopen($filename, 'w');
    fwrite($fp, $data);
    fclose($fp);
  }

  public function getSQLMapper($table, $pk = null)
  {
    return new SQLMapper($this->PDO->getConnection(), $table, $pk);
  }
}
new ItemsImporter();