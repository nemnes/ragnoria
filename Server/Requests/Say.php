<?php

namespace Server\Requests;

use Server\Classes\Player;

class Say extends BaseRequest
{
  public function initialize(Player $player, $message)
  {
    if(strtolower($message) === 'exori vis' || strtolower($message) === 'exori mort') {

      $targetX = $player->X;
      $targetY = $player->Y;
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
          $playerOnArea->send('Libs_Effect.run', [1, $targetX, $targetY]);
        }
      }

      if(strtolower($message) === 'exori mort') {
        /** @var Player $playerOnArea */
        foreach($player->getPlayersOnArea(false) as $playerOnArea) {
          $playerOnArea->send('Libs_Effect.run', [3, $targetX, $targetY]);
        }
      }
    }

//    /** @var Player $playerOnArea */
//    foreach($player->getPlayersOnArea(false) as $playerOnArea) {
//      $playerOnArea->send('Libs_Chat.appendMessage', [$message, $player->Name, $player->X, $player->Y]);
//    }
  }
}