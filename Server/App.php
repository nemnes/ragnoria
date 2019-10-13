<?php

namespace Server;

use Libs\SQLMapper;
use Server\Classes\Item;
use Server\Classes\Player;

class App
{
  public function __construct()
  {
    ini_set('memory_limit','258M');
    if (is_resource($fp = @fsockopen($host = Settings::SERVER['HOST'], $port = Settings::SERVER['PORT']))) {
      fclose($fp);
      $this->log("Socket $host:$port is already open!", true);
      exit();
    }
    $this->log("-- RagnoriaSrv v1.1 --", true);
  }

  public function run()
  {
    $this->get('PDO');
    $this->get('World');
    $this->get('IoServer')->run();
  }

  public function newItem($itemId)
  {
    return new Item($this, [$itemId]);
  }

  public function newPlayer($playerId, $conn)
  {
    return new Player($this, [$playerId, $conn]);
  }

  public function get($name)
  {
    global $container;
    return $container->offsetGet($name);
  }

  public function getWorld()
  {
    return $this->get('World');
  }

  public function getSQLMapper($table, $pk = null)
  {
    return new SQLMapper($this->get('PDO')->getConnection(), $table, $pk);
  }

  public function log($msg = '', $separated = false)
  {
    if(is_object($msg) || is_array($msg)) {
      $msg = json_encode($msg);
    }
    if($separated) echo date('H:i:s') . " | \n";
    echo date('H:i:s') . " | " . $msg . "\n";
    if($separated) echo date('H:i:s') . " | \n";
  }

}

require '../vendor/autoload.php';
$app = new App();
include('dependencies.php');
$app->run();