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
  public $Locks;

  /** @var ConnectionInterface */
  private $Connection;

  public function initialize($playerId, $conn)
  {
    $tblPlayer = $this->getSQLMapper('tblPlayer', $playerId);
    $this->Id = $tblPlayer->Id;
    $this->Name = $tblPlayer->Name;
    $this->X = $tblPlayer->X;
    $this->Y = $tblPlayer->Y;

    $this->Locks = new \stdClass();
    $this->Locks->Movement = null;

    $this->Connection = $conn;
    $this->Connection->Player = $this;

    $this->getWorld()->addPlayer($this);
    $this->getApp()->log("Player " .$conn->Player->Name. " logged in. Players online: " .$this->getWorld()->getPlayersOnline());
  }

  public function logout()
  {
    $tblPlayer = $this->getSQLMapper('tblPlayer', $this->Id);
    $tblPlayer->Id = $this->Id;
    $tblPlayer->Name = $this->Name;
    $tblPlayer->X = $this->X;
    $tblPlayer->Y = $this->Y;
    $tblPlayer->save();

    $this->getWorld()->removePlayer($this);
    $this->getApp()->log("Player " .$this->Name. " logged out. Players online: " .$this->getWorld()->getPlayersOnline());
    unset($this->Connection->Player);
    $this->Connection->close();
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
    foreach($sqm_range_y as $y) {
      foreach($sqm_range_x as $x) {
        $area[$y][$x] = $this->getWorld()->getSQM($x,$y);
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
        $players[] = $player;
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
        $NPCs[] = $npc;
      }
    }
    return $NPCs;
  }
}