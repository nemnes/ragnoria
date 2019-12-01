<?php

namespace Server\Classes;

use Server\Settings;

class World extends BaseClass
{
  private $Grid = [];
  private $Players = [];
  private $NPCs = [];

  public function initialize()
  {
    $this->createGrid();
    $this->createNPCs();
  }

  private function createGrid()
  {
    $scheme = json_decode(file_get_contents(Settings::PATH['WORLD']. '/World_01_01.json'), true);
    foreach($scheme as $y => $row) {
      foreach($row as $x => $tile) {
        $sqm = $this->getApp()->newSQM();
        foreach($tile as $itemId) {
          $sqm->addItem($itemId);
        }
        $this->Grid[$x][$y] = $sqm;
      }
    }
    $scheme = json_decode(file_get_contents(Settings::PATH['WORLD']. '/World_01_02.json'), true);
    foreach($scheme as $y => $row) {
      foreach($row as $x => $tile) {
        $sqm = $this->getApp()->newSQM();
        foreach($tile as $itemId) {
          $sqm->addItem($itemId);
        }
        $this->Grid[$x+100][$y] = $sqm;
      }
    }
    unset($scheme);
  }

  public function createNPCs()
  {
    $this->NPCs[1] = $this->getApp()->newNPC(1);
    $this->NPCs[2] = $this->getApp()->newNPC(2);
    $this->NPCs[3] = $this->getApp()->newNPC(3);
    $this->NPCs[4] = $this->getApp()->newNPC(4);
    $this->NPCs[5] = $this->getApp()->newNPC(5);
  }

  public function addPlayer(Player $player)
  {
    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Player.move', [$player, '-']);
      $playerOnArea->send('Libs_Effect.run', [1, $player->X, $player->Y]);
    }
    $this->Players[$player->Id] = $player;
  }

  public function removePlayer(Player $player)
  {
    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Player.remove', [$player->Id]);
      $playerOnArea->send('Libs_Effect.run', [2, $player->X, $player->Y]);
    }
    if(isset($this->Players[$player->Id])) {
      unset($this->Players[$player->Id]);
      return true;
    }
    return false;
  }

  public function getPlayer($playerId)
  {
    if(isset($this->Players[$playerId])) {
      return $this->Players[$playerId];
    }
    return false;
  }

  public function getPlayers()
  {
    return $this->Players;
  }

  public function getPlayersOnline()
  {
    return count($this->Players);
  }

  public function getSQM($x, $y)
  {
    if(isset($this->Grid[$x][$y])) {
      return $this->Grid[$x][$y];
    }
    return false;
  }

  public function getNPC($id)
  {
    if(isset($this->NPCs[$id])) {
      return $this->NPCs[$id];
    }
    return false;
  }

  public function getNPCs()
  {
    return $this->NPCs;
  }

  public function getCreatureBySQM($X, $Y)
  {
    foreach($this->Players as $player) {
      if($player->X == $X && $player->Y == $Y) {
        return $player;
      }
    }
    foreach($this->NPCs as $npc) {
      if($npc->X == $X && $npc->Y == $Y) {
        return $npc;
      }
    }
    return null;
  }

}