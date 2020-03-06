<?php

namespace Server\Data\Actions;

use Server\App;

class Actions
{
  public $ActionList = [
//    ['WalkOn', '4009', 'WalkOnMagicForceField'],
//    ['WalkOn', '4029', 'WalkOnFireField'],
//    ['WalkOn', '1017', 'WalkOnClickableStoneTile'],
//    ['WalkOut', '1018', 'WalkOutClickableStoneTile'],
//    ['ItemPushOn', '4009', 'ItemPushOnMagicForceField'],
//    ['ItemUse', '3045', 'ItemUseDoor'],
//    ['ItemUse', '3046', 'ItemUseDoor'],
//    ['ItemUse', '3047', 'ItemUseDoor'],
//    ['ItemUse', '3048', 'ItemUseDoor'],

    ['ItemUse', '4049', 'ItemUseBlueberryBush'],
    ['ItemUse', '5066', 'ItemUseStreetLamp'],
    ['ItemUse', '5067', 'ItemUseStreetLamp'],
    ['ItemUse', '6000', 'ItemUseWallLamp'],
    ['ItemUse', '6001', 'ItemUseWallLamp'],
    ['ItemUse', '6002', 'ItemUseWallLamp'],
    ['ItemUse', '6003', 'ItemUseWallLamp'],
    ['ItemUse', '6004', 'ItemUseWallLamp'],
    ['ItemUse', '6005', 'ItemUseWallLamp'],
    ['ItemUse', '6006', 'ItemUseWallLamp'],
    ['ItemUse', '6007', 'ItemUseWallLamp'],

    // stairs/holes/teleports
    ['WalkOn', '3000', 'WalkOnUpStairs'],
    ['WalkOn', '3001', 'WalkOnUpStairs'],
    ['WalkOn', '3002', 'WalkOnUpStairs'],
    ['WalkOn', '3003', 'WalkOnUpStairs'],
    ['WalkOn', '3176', 'WalkOnUpStairs'],
    ['WalkOn', '3179', 'WalkOnUpStairs'],
    ['WalkOn', '3180', 'WalkOnUpStairs'],
    ['ItemPushOn', '3000', 'ItemPushOnUpStairs'],
    ['ItemPushOn', '3001', 'ItemPushOnUpStairs'],
    ['ItemPushOn', '3002', 'ItemPushOnUpStairs'],
    ['ItemPushOn', '3003', 'ItemPushOnUpStairs'],
    ['ItemPushOn', '3176', 'ItemPushOnUpStairs'],
    ['ItemPushOn', '3179', 'ItemPushOnUpStairs'],
    ['ItemPushOn', '3180', 'ItemPushOnUpStairs'],
    ['WalkOn', '3', 'WalkOnDownStairs'],
    ['WalkOn', '4', 'WalkOnDownStairs'],
    ['WalkOn', '5', 'WalkOnDownStairs'],
    ['ItemPushOn', '3', 'ItemPushOnDownStairs'],
    ['ItemPushOn', '4', 'ItemPushOnDownStairs'],
    ['ItemPushOn', '5', 'ItemPushOnDownStairs'],

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