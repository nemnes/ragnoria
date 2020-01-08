<?php

namespace Server\Classes;

use Libs\MiscHelper;
use Ratchet\ConnectionInterface;
use Server\Settings;

class Player extends Creature
{
  public $Id;
  public $Name;
  public $X;
  public $Y;
  public $Z;
  public $Direction;
  public $Speed;
  public $Locks;

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

  /** @var ConnectionInterface */
  private $Connection;

  public function initialize($playerId, $conn)
  {
    $tblPlayer = $this->getSQLMapper('tblPlayer', $playerId);
    $this->Id = $tblPlayer->Id;
    $this->Name = $tblPlayer->Name;
    $this->X = $tblPlayer->X;
    $this->Y = $tblPlayer->Y;
    $this->Z = $tblPlayer->Z;
    $this->Direction = $tblPlayer->Direction;
    $this->Speed = (int) $tblPlayer->Speed;

    // outfit
    $this->Base = $tblPlayer->Base;
    $this->Head = $tblPlayer->Head;
    $this->Body = $tblPlayer->Body;
    $this->Back = $tblPlayer->Back;
    $this->Hands = $tblPlayer->Hands;
    $this->HeadColor = $tblPlayer->HeadColor;
    $this->PrimaryColor = $tblPlayer->PrimaryColor;
    $this->SecondaryColor = $tblPlayer->SecondaryColor;
    $this->DetailColor = $tblPlayer->DetailColor;

    $this->Locks = new \stdClass();
    $this->Locks->Movement = null;

    $this->Connection = $conn;
    $this->Connection->Player = $this;

    $this->getWorld()->addPlayer($this);
    $this->getWorld()->getSQM($tblPlayer->X, $tblPlayer->Y, $tblPlayer->Z)->walkOn($this);
    $this->getApp()->log("Player " .$conn->Player->Name. " logged in. Players online: " .$this->getWorld()->getPlayersOnline());
  }

  public function logout()
  {
    $tblPlayer = $this->getSQLMapper('tblPlayer', $this->Id);
    $tblPlayer->Id = $this->Id;
    $tblPlayer->Name = $this->Name;
    $tblPlayer->X = $this->X;
    $tblPlayer->Y = $this->Y;
    $tblPlayer->Z = $this->Z;
    $tblPlayer->Direction = $this->Direction;
    $tblPlayer->Base = $this->Base;
    $tblPlayer->Head = $this->Head;
    $tblPlayer->Body = $this->Body;
    $tblPlayer->Back = $this->Back;
    $tblPlayer->Hands = $this->Hands;
    $tblPlayer->HeadColor = $this->HeadColor;
    $tblPlayer->PrimaryColor = $this->PrimaryColor;
    $tblPlayer->SecondaryColor = $this->SecondaryColor;
    $tblPlayer->DetailColor = $this->DetailColor;
    $tblPlayer->save();

    $this->getWorld()->removePlayer($this);
    $this->getWorld()->getSQM($tblPlayer->X, $tblPlayer->Y, $tblPlayer->Z)->walkOut($this);
    $this->getApp()->log("Player " .$this->Name. " logged out. Players online: " .$this->getWorld()->getPlayersOnline());

    unset($this->Connection->Player);
    $this->Connection->close();
  }

  public function move(SQM $SQM, $direction = false) {
    $playersOnAreaBeforeStep = $this->getPlayersOnArea();
    $playersStillOnArea = array();

    $this->getWorld()->getSQM($this->X, $this->Y, $this->Z)->walkOut($this);
    $this->X = $SQM->X;
    $this->Y = $SQM->Y;
    $this->Z = $SQM->Z;
    if($direction) {
      $this->Direction = $direction;
    }
    $this->getWorld()->getSQM($SQM->X, $SQM->Y, $SQM->Z)->walkOn($this);

    $this->send('Libs_Movement.updatePosition', ['success', $this->X, $this->Y, $this->Z, $this->Direction, $this->getArea(), $this->getPlayersOnArea(), $this->getNPCsOnArea()]);

    /** @var Player $playerOnArea */
    foreach($this->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Player.move', [$this]);
      $playersStillOnArea[] = $playerOnArea->Id;
    }
    foreach($playersOnAreaBeforeStep as $playerOnArea) {
      if(!in_array($playerOnArea->Id, $playersStillOnArea)) {
        $playerOnArea->send('Libs_Player.remove', [$this->Id]);
      }
    }
  }

  public function teleport(SQM $SQM) {
    $this->move($SQM);

    /** @var Player $playerOnArea */
    foreach($this->getPlayersOnArea(false) as $playerOnArea) {
      $playerOnArea->send('Libs_Effect.run', [1, $this->X, $this->Y, $this->Z]);
      $playersStillOnArea[] = $playerOnArea->Id;
    }
  }

  public function send($method, $params = array())
  {
    $this->getConnection()->send(MiscHelper::prepareResponse($method, $params));
  }

  public function getConnection()
  {
    return $this->Connection;
  }

  public function getCookie($cookie)
  {
    return $this->getApp()->get('WebsocketEventHandler')->getCookie($this->getConnection(), $cookie);
  }

  public function getArea()
  {
    $factor_x = (ceil(Settings::GAME['CLIENT_SQM_WIDTH']/2)-1);
    $factor_y = (ceil(Settings::GAME['CLIENT_SQM_HEIGHT']/2)-1);
    $sqm_range_x = range(($this->X - $factor_x),($this->X + $factor_x));
    $sqm_range_y = range(($this->Y - $factor_y),($this->Y + $factor_y));
    $area = array();
    foreach([0,1,2] as $z) {
      foreach ($sqm_range_y as $y) {
        $y = $y+($z-$this->Z);
        foreach ($sqm_range_x as $x) {
          $x = $x+($z-$this->Z);
          $area[$z][$y][$x] = $this->getWorld()->getSQM($x, $y, $z) ? $this->getWorld()->getSQM($x, $y, $z)->Items : [];
        }
      }
    }
    return $area;
  }

  public function getPlayersOnArea($ignoreActivePlayer = true)
  {
    $factor_x = (ceil(Settings::GAME['CLIENT_SQM_WIDTH']/2)-1);
    $factor_y = (ceil(Settings::GAME['CLIENT_SQM_HEIGHT']/2)-1);
    $sqm_range_x = range(($this->X - $factor_x),($this->X + $factor_x));
    $sqm_range_y = range(($this->Y - $factor_y),($this->Y + $factor_y));
    $players = array();
    /** @var Player $player */
    foreach($this->getApp()->getWorld()->getPlayers() as $player) {
      if($ignoreActivePlayer && $player->Id === $this->Id) {
        continue;
      }
      if(in_array($player->X, $sqm_range_x) && in_array($player->Y, $sqm_range_y)) {
        $players[$player->Id] = $player;
      }
    }
    return $players;
  }

  public function getNPCsOnArea()
  {
    $factor_x = (ceil(Settings::GAME['CLIENT_SQM_WIDTH']/2)-1);
    $factor_y = (ceil(Settings::GAME['CLIENT_SQM_HEIGHT']/2)-1);
    $sqm_range_x = range(($this->X - $factor_x),($this->X + $factor_x));
    $sqm_range_y = range(($this->Y - $factor_y),($this->Y + $factor_y));
    $NPCs = array();
    /** @var NPC $npc */
    foreach($this->getApp()->getWorld()->getNPCs() as $npc) {
      if(in_array($npc->X, $sqm_range_x) && in_array($npc->Y, $sqm_range_y)) {
        $NPCs[$npc->Id] = $npc;
      }
    }
    return $NPCs;
  }

  public function getPos()
  {
    return [$this->X, $this->Y, $this->Z];
  }

}