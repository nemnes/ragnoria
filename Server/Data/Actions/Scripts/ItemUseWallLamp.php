<?php

namespace Server\Data\Actions\Scripts;

use Server\Classes\Player;
use Server\Classes\SQM;

class ItemUseWallLamp extends BaseAction
{
  public function run(Player $player, $itemId, SQM $sqm)
  {
    // lamps \/
    if ($player->Y >= $sqm->Y) {
      if ($itemId == '6000') {
        $sqm->updateItem('6000', '6002');
      }
      if ($itemId == '6002') {
        $sqm->updateItem('6002', '6000');
      }
      if ($itemId == '6004') {
        $sqm->updateItem('6004', '6006');
      }
      if ($itemId == '6006') {
        $sqm->updateItem('6006', '6004');
      }
    }

    // lamps >
    if ($player->X >= $sqm->X) {
      if ($itemId == '6001') {
        $sqm->updateItem('6001', '6003');
      }
      if ($itemId == '6003') {
        $sqm->updateItem('6003', '6001');
      }
      if ($itemId == '6005') {
        $sqm->updateItem('6005', '6007');
      }
      if ($itemId == '6007') {
        $sqm->updateItem('6007', '6005');
      }
    }
  }
}