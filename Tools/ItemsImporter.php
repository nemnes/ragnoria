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
    $this->createFile('MapEditor/items.json', json_encode($items));
  }

  public function import()
  {
    $items = array();
    $tblItem = $this->getSQLMapper('tblItem');
    foreach($tblItem->find(array()) as $row) {
      $item = new stdClass();
      $item->Id = $row->Id;
      $item->Type = $row->ItemTypeId;
      $item->Name = $row->Name;
      $item->Size = $row->Size;
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