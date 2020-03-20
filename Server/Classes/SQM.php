<?php

namespace Server\Classes;

use Server\Settings;

class SQM extends BaseClass
{
  public $X;
  public $Y;
  public $Z;
  public $Items = array();

  public function initialize($x, $y, $z)
  {
    $this->X = $x;
    $this->Y = $y;
    $this->Z = $z;
  }

  public function addItem($itemId, $quantity = null, $send = true)
  {
    $this->Items[] = $quantity ? [$itemId, $quantity] : [$itemId];
    if($send) {
      foreach($this->getPlayersOnArea() as $playerOnArea) {
        $playerOnArea->send('Libs_Board.updateSQM', [$this->X, $this->Y, $this->Z, $this->Items]);
      }
    }
  }

  public function removeItem($itemId, $quantity = 1)
  {
    if(!empty($this->Items) && end($this->Items)[0] == $itemId) {
      if(end($this->Items)[1] > $quantity) {
        end($this->Items);
        $key = key($this->Items);
        $this->Items[$key][1]--;
      }
      else {
        array_pop($this->Items);
      }
      foreach($this->getPlayersOnArea() as $playerOnArea) {
        $playerOnArea->send('Libs_Board.updateSQM', [$this->X, $this->Y, $this->Z, $this->Items]);
      }
      return true;
    }
    return false;
  }

  public function updateItem($fromItemId, $toItemId)
  {
    foreach($this->Items as &$item) {
      if($item[0] == $fromItemId) {
        $item[0] = $toItemId;
        foreach($this->getPlayersOnArea() as $playerOnArea) {
          $playerOnArea->send('Libs_Board.updateSQM', [$this->X, $this->Y, $this->Z, $this->Items]);
        }
        return true;
      }
    }
    return false;
  }

  public function getItemFromTop()
  {
    foreach(array_reverse($this->Items, true) as &$item) {
      $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($item[0]);
      if($structure->Name) {
        return $item;
      }
    }
    return false;
  }

  public function isWalkable()
  {
    if(empty($this->Items)) {
      return false;
    }
    foreach($this->Items as $item) {
      $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($item[0]);
      if($structure->IsBlocking) {
        return false;
      }
    }
    return true;
  }

  public function isBlockingItems()
  {
    foreach($this->Items as $item) {
      $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($item[0]);
      if($structure->IsBlockingItems) {
        return true;
      }
    }
    return false;
  }

  public function isBlockingProjectiles()
  {
    foreach($this->Items as $item) {
      $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($item[0]);
      if($structure->IsBlockingProjectiles) {
        return true;
      }
    }
    return false;
  }

  public function hasFloor()
  {
    foreach($this->Items as $item) {
      $structure = $this->getApp()->get('ItemStructureCollection')->getItemStructure($item[0]);
      if($structure->ItemTypeId == 1) {
        return true;
      }
    }
    return false;
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
        $players[$player->Id] = $player;
      }
    }
    return $players;
  }

  public function walkOn(Player $player)
  {
    foreach($this->Items as $item) {
      if($action = $this->getApp()->getAction('WalkOn', $item[0])) {
        $action->run($player, $item[0], $this);
      }
    }
  }

  public function walkOut(Player $player)
  {
    foreach($this->Items as $item) {
      if($action = $this->getApp()->getAction('WalkOut', $item[0])) {
        $action->run($player, $item[0], $this);
      }
    }
  }

  public function getPos()
  {
    return [$this->X, $this->Y, $this->Z];
  }

}