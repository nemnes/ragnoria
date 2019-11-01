<?php

namespace Server\Classes;

abstract class Creature extends BaseClass
{
  public $X;
  public $Y;

  public function goNorth()
  {
    return $this->go('North');
  }

  public function goEast()
  {
    return $this->go('East');
  }

  public function goSouth()
  {
    return $this->go('South');
  }


  public function goWest()
  {
    return $this->go('West');
  }

  private function go($direction)
  {
    $targetPosition = array('X' => $this->X, 'Y' => $this->Y);
    switch($direction) {
      case 'North':
        $targetPosition['Y']--;
        break;
      case 'East':
        $targetPosition['X']++;
        break;
      case 'South':
        $targetPosition['Y']++;
        break;
      case 'West':
        $targetPosition['X']--;
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
      return true;
    }
    return false;
  }
}