<?php

namespace Server\Classes;

use Server\Settings;

class World extends BaseClass
{
  private $Grid = [];
  private $Players = [];

  public function initialize()
  {
    $this->createGrid();
  }

  private function createGrid()
  {
    $scheme = json_decode(file_get_contents(Settings::PATH['WORLD']), true);
    foreach($scheme as $y => $row) {
      foreach($row as $x => $tile) {
        $sqm = $this->newSQM($tile[0]);
        foreach($tile[1] as $itemId) {
          $sqm->addItem($this->getApp()->newItem($itemId));
        }
        $this->Grid[$x][$y] = $sqm;
      }
    }
    unset($scheme);
  }

  public function addPlayer(Player $player)
  {
    foreach($player->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Player.move', [$player, '-']);
      $playerOnArea->send('Libs_Effect.run', [1, $player->X, $player->Y]);
    }
    $this->Players[$player->Id] = $player;
  }

  public function removePlayer(Player $player)
  {
    foreach($player->getPlayersOnArea() as $playerOnArea) {
      $playerOnArea->send('Libs_Player.remove', [$player->Id]);
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

  private function newSQM($itemId)
  {
    return new SQM($this->getApp()->newItem($itemId));
  }

  public function getSQM($x, $y)
  {
    if(isset($this->Grid[$x][$y])) {
      return $this->Grid[$x][$y];
    }
    return false;
  }

}