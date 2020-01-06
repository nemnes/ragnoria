<?php

namespace Server\Data\Actions\Scripts;

use Server\App;

abstract class BaseAction
{
  private $App;

  public function __construct(App $app)
  {
    $this->App = $app;
  }

  public function getApp()
  {
    return $this->App;
  }
}