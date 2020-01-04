<?php

namespace Server\Classes;

use Libs\MiscHelper;
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
    foreach(glob(Settings::PATH['DATA']. '/World/*') as $worldDir) {

      // only level 0
      if(basename($worldDir) > 0) {
        break;
      }

      foreach(glob($worldDir. '/*', GLOB_BRACE) as $areaDir) {
        $areaZ = (int) basename($worldDir);
        $areaY = (int) explode('-', str_replace('.json', '', basename($areaDir)))[0];
        $areaX = (int) explode('-', str_replace('.json', '', basename($areaDir)))[1];

        $scheme = json_decode(file_get_contents($areaDir), true);
        foreach($scheme as $y => $row) {
          foreach($row as $x => $tile) {
            $sqm = $this->getApp()->newSQM($x+($areaX*100),$y+($areaY*100));
            foreach($tile as $itemId) {
              if(is_array($itemId)) {
                $sqm->addItem($itemId[0], $itemId[1]);
              }
              else {
                $sqm->addItem($itemId);
              }
            }
            $this->Grid[$x+($areaX*100)][$y+($areaY*100)] = $sqm;
          }
        }

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

  /**
   * @param $x
   * @param $y
   * @return SQM|false
   */
  public function getSQM($x, $y)
  {
    if(isset($this->Grid[$x][$y])) {
      return $this->Grid[$x][$y];
    }
    return false;
  }

  public function getSQMsBetween(SQM $sqmFrom, SQM $sqmTo)
  {
    $result = array();
    $fields = MiscHelper::getFieldsBetween(
      ['X' => $sqmFrom->X, 'Y' => $sqmFrom->Y],
      ['X' => $sqmTo->X, 'Y' => $sqmTo->Y]
    );
    foreach($fields as $y => $row) {
      foreach($row as $x => $tile) {
        $result[] = $this->getSQM($x, $y);
      }
    }
    return $result;
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

  public function getPlayersOnArea($x, $y)
  {
    $factor_x = (ceil(Settings::GAME['CLIENT_SQM_WIDTH']/2)-1);
    $factor_y = (ceil(Settings::GAME['CLIENT_SQM_HEIGHT']/2)-1);
    $sqm_range_x = range(($x - $factor_x),($x + $factor_x));
    $sqm_range_y = range(($y - $factor_y),($y + $factor_y));
    $players = array();
    /** @var Player $player */
    foreach($this->getApp()->getWorld()->getPlayers() as $player) {
      if(in_array($player->X, $sqm_range_x) && in_array($player->Y, $sqm_range_y)) {
        $players[$player->Id] = $player;
      }
    }
    return $players;
  }


}