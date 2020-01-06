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

    /** @var Player $playerOnArea */
    foreach($player->getPlayersOnArea(false) as $playerOnArea) {
      $playerOnArea->send('Libs_Chat.prepareMessage', [$message, $player->Name, $player->X, $player->Y, $player->Z]);
    }
  }
}