<?php

namespace Server\Data\Actions;

use Server\App;

class Actions
{
  public $ActionList = [
    ['WalkOn', '4009', 'WalkOnMagicForceField'],
    ['WalkOn', '4029', 'WalkOnFireField'],
    ['WalkOn', '3055', 'WalkOnUpStairs'],
    ['WalkOn', '3056', 'WalkOnUpStairs'],
    ['WalkOn', '3057', 'WalkOnUpStairs'],
    ['WalkOn',    '3', 'WalkOnDownStairs'],
    ['WalkOn', '1014', 'WalkOnDownStairs'],
    ['WalkOn', '1015', 'WalkOnDownStairs'],
    ['WalkOn', '1016', 'WalkOnDownStairs'],
    ['WalkOn', '1017', 'WalkOnClickableStoneTile'],

    ['WalkOut', '1018', 'WalkOutClickableStoneTile'],

    ['ItemPushOn', '4009', 'ItemPushOnMagicForceField'],
    ['ItemPushOn', '3055', 'ItemPushOnUpStairs'],
    ['ItemPushOn', '3056', 'ItemPushOnUpStairs'],
    ['ItemPushOn', '3057', 'ItemPushOnUpStairs'],
    ['ItemPushOn',    '3', 'ItemPushOnDownStairs'],
    ['ItemPushOn', '1014', 'ItemPushOnDownStairs'],
    ['ItemPushOn', '1015', 'ItemPushOnDownStairs'],
    ['ItemPushOn', '1016', 'ItemPushOnDownStairs'],

    ['ItemUse', '3045', 'ItemUseDoor'],
    ['ItemUse', '3046', 'ItemUseDoor'],
    ['ItemUse', '3047', 'ItemUseDoor'],
    ['ItemUse', '3048', 'ItemUseDoor'],
    ['ItemUse', '4039', 'ItemUseStreetLamp'],
    ['ItemUse', '4040', 'ItemUseStreetLamp'],
  ];

  public $Actions = [];

  public function __construct(App $app)
  {
    foreach($this->ActionList as $action) {
      $class = 'Server\Data\Actions\Scripts\\' . $action[2];
      $this->Actions[$action[0]][$action[1]] = new $class($app);
    }
  }

  public function getAction($type, $itemId)
  {
    if(isset($this->Actions[$type]) && isset($this->Actions[$type][$itemId])) {
      return $this->Actions[$type][$itemId];
    }
    return false;
  }
}