<?php

namespace Server\Requests;

use ArgumentCountError;
use Server\App;

abstract class BaseRequest
{
  /** @var App */
  private $App;

  public function __construct(App $app, $params = [])
  {
    $this->App = $app;
    try {
      call_user_func_array([$this, "initialize"], $params);
    }
    catch(ArgumentCountError $e) {
      $this->getApp()->log($e->getMessage());
    }
  }

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