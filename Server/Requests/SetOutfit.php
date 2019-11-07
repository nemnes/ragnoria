<?php

namespace Server\Requests;

use Server\Classes\Player;

class SetOutfit extends BaseRequest
{
  public function initialize(Player $player, $lookType)
  {
    $player->Base = 1;
    $player->Head = $lookType->Head;
    $player->Body = $lookType->Body;
    $player->Back = $lookType->Back;
    $player->Hands = $lookType->Hands;
    $player->HeadColor = $lookType->HeadColor;
    $player->PrimaryColor = $lookType->PrimaryColor;
    $player->SecondaryColor = $lookType->SecondaryColor;
    $player->DetailColor = $lookType->DetailColor;

  }
}