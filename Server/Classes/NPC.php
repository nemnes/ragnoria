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
  public $Z;
  public $Direction;

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
    $this->Z = $tblNPC->Z;
    $this->Direction = 'South';

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
}