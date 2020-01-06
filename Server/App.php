<?php

namespace Server;

use Libs\SQLMapper;
use Server\Classes\Item;
use Server\Classes\NPC;
use Server\Classes\Player;
use Server\Classes\SQM;
use Server\Classes\World;

class App
{
  public function __construct()
  {
    ini_set('memory_limit','258M');
    if(!class_exists('Server\Settings')) {
      $this->log("File '~/Server/Settings.php' not found.", true);
      exit();
    }
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
    $this->get('Actions');
    $this->get('World');
    $this->get('IoServer')->run();
  }

  public function newPlayer($playerId, $conn)
  {
    return new Player($this, [$playerId, $conn]);
  }


  public function newNPC($id)
  {
    return new NPC($this, [$id]);
  }

  public function newSQM($x, $y, $z)
  {
    return new SQM($this, [$x, $y, $z]);
  }

  public function get($name)
  {
    global $container;
    return $container->offsetGet($name);
  }

  /** @return World */
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

  public function getAction($type, $itemId)
  {
    return $this->get('Actions')->getAction($type, $itemId);
  }

}

require __DIR__ . '/../vendor/autoload.php';

$app = new App();
include('dependencies.php');
$app->run();