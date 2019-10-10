<?php

namespace Server\Timers;

use Libs\ServerUsage;

class SaveState extends BaseTimer
{
  public $Time = 60*30;

  public function initialize()
  {
    $tblServerStatus = $this->getApp()->getSQLMapper('tblServerStatus');
    $tblServerStatus->DateTime = date('Y-m-d H:i:s');
    $tblServerStatus->Online = $this->getWorld()->getPlayersOnline();
    $tblServerStatus->AllocatedMemory = ServerUsage::getAllocatedMemory();
    $tblServerStatus->MemoryUsage = ServerUsage::getMemoryUsage();
    $tblServerStatus->save();
  }
}