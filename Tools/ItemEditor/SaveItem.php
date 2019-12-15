<?php

use Libs\DBConnector;
use Libs\SQLMapper;
use Server\Settings;

require('../../Libs/DBConnector.php');
require('../../Libs/SQLMapper.php');
require('../../Server/Settings.php');

class SaveItem {
  public $PDO;

  public function __construct() {
    $this->PDO = new DBConnector(Settings::DATABASE['HOST'], Settings::DATABASE['USERNAME'], Settings::DATABASE['PASSWORD'], Settings::DATABASE['DATABASE']);
    $tblItem = $this->getSQLMapper('tblItem', $_POST['Id']);
    foreach($_POST as $attr=>$value) {
      $tblItem->{$attr} = $value;
    }
    $tblItem->save();
  }

  public function getSQLMapper($table, $pk = null)
  {
    return new SQLMapper($this->PDO->getConnection(), $table, $pk);
  }

}
new SaveItem();