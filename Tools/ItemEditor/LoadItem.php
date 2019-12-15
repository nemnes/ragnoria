<?php

use Libs\DBConnector;
use Libs\SQLMapper;
use Server\Settings;

require('../../Libs/DBConnector.php');
require('../../Libs/SQLMapper.php');
require('../../Server/Settings.php');

class LoadItem {
  public $PDO;

  public function __construct() {
    $this->PDO = new DBConnector(Settings::DATABASE['HOST'], Settings::DATABASE['USERNAME'], Settings::DATABASE['PASSWORD'], Settings::DATABASE['DATABASE']);
    $item = $this->getSQLMapper('tblItem', $_GET['id']);
    echo json_encode($item);
  }

  public function getSQLMapper($table, $pk = null)
  {
    return new SQLMapper($this->PDO->getConnection(), $table, $pk);
  }
}
new LoadItem();