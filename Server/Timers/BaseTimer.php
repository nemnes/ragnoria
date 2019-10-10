<?php

namespace Server\Timers;

use Server\App;

abstract class BaseTimer
{
  /** @var App */
  private $App;
  public $Time = null;

  public function __construct(App $app, $server)
  {
    $this->App = $app;
    $this->getApp()->log('- ' .get_called_class());
    if($this->Time) {
      $server->loop->addPeriodicTimer($this->Time, function() { $this->initialize(); });
    }
  }

  abstract public function initialize();

  public function getApp()
  {
    return $this->App;
  }

  public function getWorld()
  {
    return $this->getApp()->getWorld();
  }

  public function getSQLMapper($table, $pk = null)
  {
    return $this->getApp()->getSQLMapper($table, $pk);
  }

}