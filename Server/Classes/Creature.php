<?php

namespace Server\Classes;

abstract class Creature extends BaseClass
{
  public $X;
  public $Y;
  public $Direction;
  public $Speed;

  public function goNorth()
  {
    return $this->go('North');
  }

  public function goNorthEast()
  {
    return $this->go('NorthEast');
  }

  public function goEast()
  {
    return $this->go('East');
  }

  public function goSouthEast()
  {
    return $this->go('SouthEast');
  }

  public function goSouth()
  {
    return $this->go('South');
  }

  public function goSouthWest()
  {
    return $this->go('SouthWest');
  }

  public function goWest()
  {
    return $this->go('West');
  }

  public function goNorthWest()
  {
    return $this->go('NorthWest');
  }

  private function go($direction)
  {
    $targetPosition = array('X' => $this->X, 'Y' => $this->Y);
    switch($direction) {
      case 'North':
        $targetPosition['Y']--;
        break;
      case 'NorthEast':
        $targetPosition['Y']--;
        $targetPosition['X']++;
        break;
      case 'East':
        $targetPosition['X']++;
        break;
      case 'SouthEast':
        $targetPosition['X']++;
        $targetPosition['Y']++;
        break;
      case 'South':
        $targetPosition['Y']++;
        break;
      case 'SouthWest':
        $targetPosition['X']--;
        $targetPosition['Y']++;
        break;
      case 'West':
        $targetPosition['X']--;
        break;
      case 'NorthWest':
        $targetPosition['X']--;
        $targetPosition['Y']--;
        break;
      default:
        return false;
    }

    if($this->getWorld()->getCreatureBySQM($targetPosition['X'], $targetPosition['Y'])) {
      return false;
    }

    /** @var SQM $SQM */
    $SQM = $this->getWorld()->getSQM(($targetPosition['X']), $targetPosition['Y']);
    if($SQM->isWalkable()) {
      $this->X = $targetPosition['X'];
      $this->Y = $targetPosition['Y'];
      $this->Direction = $direction;
      return true;
    }
    return false;
  }
}