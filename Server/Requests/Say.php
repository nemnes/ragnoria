<?php

namespace Server\Requests;

use Server\Classes\Player;

class Say extends BaseRequest
{
  public function initialize(Player $player, $message)
  {
    $message = trim($message);
    if(strlen($message) === 0 || strlen($message) > 255) {
      return;
    }

    if(strtolower($message) === 'exori vis' || strtolower($message) === 'exori mort') {

      $targetX = $player->X;
      $targetY = $player->Y;
      $targetZ = $player->Z;
      switch($player->Direction) {
        case "NorthEast":
        case "East":
        case "SouthEast":
          $targetX++;
          break;
        case "NorthWest":
        case "West":
        case "SouthWest":
          $targetX--;
          break;
        case "South":
          $targetY++;
          break;
        case "North":
          $targetY--;
          break;
      }

      if(strtolower($message) === 'exori vis') {
        /** @var Player $playerOnArea */
        foreach($player->getPlayersOnArea(false) as $playerOnArea) {
          $playerOnArea->send('Libs_Effect.run', [1, $targetX, $targetY, $targetZ]);
        }
      }

      if(strtolower($message) === 'exori mort') {
        /** @var Player $playerOnArea */
        foreach($player->getPlayersOnArea(false) as $playerOnArea) {
          $playerOnArea->send('Libs_Effect.run', [3, $targetX, $targetY, $targetZ]);
        }
      }
    }

    if($message[0] === '/') {
      $split = explode(' ', $message);
      $cmd = $split[0];
      $param1 = isset($split[1]) ? $split[1] : null;
      $param2 = isset($split[2]) ? $split[2] : null;
      $this->runCommand($cmd, $param1, $param2, $player);
      return;
    }

    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea(false) as $playerOnArea) {
      $playerOnArea->send('Libs_Chat.prepareMessage', [$message, $player->Name, $player->X, $player->Y, $player->Z]);
    }
  }

  public function runCommand($cmd, $param1, $param2, Player $player)
  {
    if($cmd === '/up') {
      $SQM = $this->getWorld()->getSQM($player->X, $player->Y, $player->Z+1);
      if($SQM && $SQM->hasFloor()) {
        $player->teleport($SQM);
      }
      return;
    }

    if($cmd === '/down') {
      $SQM = $this->getWorld()->getSQM($player->X, $player->Y, $player->Z-1);
      if($SQM && $SQM->hasFloor()) {
        $player->teleport($SQM);
      }
      return;
    }

    if($cmd === '/a') {
      if($param1 && is_numeric($param1) && (int) $param1 == $param1 && (int) $param1 <= 9 && (int) $param1 > 0) {
        $SQM = false;
        $range = (int) $param1;
        switch($player->Direction) {
          case 'South':
            $SQM = $this->getWorld()->getSQM($player->X, $player->Y+$range, $player->Z);
            break;
          case 'East':
            $SQM = $this->getWorld()->getSQM($player->X+$range, $player->Y, $player->Z);
            break;
          case 'North':
            $SQM = $this->getWorld()->getSQM($player->X, $player->Y-$range, $player->Z);
            break;
          case 'West':
            $SQM = $this->getWorld()->getSQM($player->X-$range, $player->Y, $player->Z);
            break;
        }
        if($SQM && $SQM->hasFloor()) {
          $player->teleport($SQM);
        }
        return;
      }
    }

    if($cmd === '/temple') {
      $SQM = $this->getWorld()->getSQM(173, 47, 0);
      if($SQM && $SQM->hasFloor()) {
        $player->teleport($SQM);
      }
      return;
    }

    if($cmd === '/depot') {
      $SQM = $this->getWorld()->getSQM(150, 50, 0);
      if($SQM && $SQM->hasFloor()) {
        $player->teleport($SQM);
      }
      return;
    }

    return;
  }
}