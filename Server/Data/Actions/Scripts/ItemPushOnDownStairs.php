<?php

namespace Server\Data\Actions\Scripts;

use Server\App;
use Server\Classes\Player;

class ItemPushOnDownStairs
{
  public function run(App $app, Player $player, $itemId, &$fromSQM, &$toSQM)
  {
    $toSQM = $app->getWorld()->getSQM($toSQM->X, $toSQM->Y+1, $toSQM->Z-1);
  }
}