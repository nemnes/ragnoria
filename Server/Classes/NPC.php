<?php

namespace Server\Classes;

use Libs\MiscHelper;
use Ratchet\ConnectionInterface;
use Server\Settings;

class NPC extends Creature
{
  public $Id;
  public $Name;
  public $X;
  public $Y;

  // outfit
  public $Base;
  public $Head;
  public $Body;
  public $Back;
  public $Hands;
  public $HeadColor;
  public $PrimaryColor;
  public $SecondaryColor;
  public $DetailColor;

  public function initialize($id)
  {
    $tblNPC = $this->getSQLMapper('tblNPC', $id);
    $this->Id = $tblNPC->Id;
    $this->Name = $tblNPC->Name;
    $this->X = $tblNPC->X;
    $this->Y = $tblNPC->Y;

    // outfit
    $this->Base = $tblNPC->Base;
    $this->Head = $tblNPC->Head;
    $this->Body = $tblNPC->Body;
    $this->Back = $tblNPC->Back;
    $this->Hands = $tblNPC->Hands;
    $this->HeadColor = $tblNPC->HeadColor;
    $this->PrimaryColor = $tblNPC->PrimaryColor;
    $this->SecondaryColor = $tblNPC->SecondaryColor;
    $this->DetailColor = $tblNPC->DetailColor;
  }

  public function getArea()
  {
    $factor_x = (ceil(Settings::GAME['CLIENT_SQM_WIDTH']/2)-1);
    $factor_y = (ceil(Settings::GAME['CLIENT_SQM_HEIGHT']/2)-1);
    $sqm_range_x = range(($this->X - $factor_x),($this->X + $factor_x));
    $sqm_range_y = range(($this->Y - $factor_y),($this->Y + $factor_y));
    $area = array();
    foreach($sqm_range_y as $y) {
      foreach($sqm_range_x as $x) {
        $area[$y][$x] = $this->getWorld()->getSQM($x,$y);
      }
    }
    return $area;
  }

  public function getPlayersOnArea()
  {
    $factor_x = (ceil(Settings::GAME['CLIENT_SQM_WIDTH']/2)-1);
    $factor_y = (ceil(Settings::GAME['CLIENT_SQM_HEIGHT']/2)-1);
    $sqm_range_x = range(($this->X - $factor_x),($this->X + $factor_x));
    $sqm_range_y = range(($this->Y - $factor_y),($this->Y + $factor_y));
    $players = array();
    /** @var Player $player */
    foreach($this->getApp()->getWorld()->getPlayers() as $player) {
      if(in_array($player->X, $sqm_range_x) && in_array($player->Y, $sqm_range_y)) {
        $players[] = $player;
      }
    }
    return $players;
  }
}