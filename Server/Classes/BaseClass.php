<?php

namespace Server\Classes;

use Server\App;

abstract class BaseClass
{
  /** @var App */
  private $App;

  public function __construct(App $app, $params = [])
  {
    $this->App = $app;
    call_user_func_array([$this, "initialize"], $params);
  }

  public function getApp()
  {
    return $this->App;
  }

  /** @return World */
  public function getWorld()
  {
    return $this->getApp()->getWorld();
  }

  public function getSQLMapper($table, $pk = null)
  {
    return $this->getApp()->getSQLMapper($table, $pk);
  }

}