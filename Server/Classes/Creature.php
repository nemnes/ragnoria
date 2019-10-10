<?php

namespace Server\Classes;

abstract class Creature extends BaseClass
{
  public $X;
  public $Y;

  public function goNorth()
  {
    /** @var SQM $SQM */
    $SQM = $this->getWorld()->getSQM($this->X, ($this->Y-1));
    if($SQM->isWalkable()) {
      $this->Y--;
      return true;
    }
    return false;
  }

  public function goNorthEast()
  {
    /** @var SQM $SQM */
    $SQM = $this->getWorld()->getSQM(($this->X+1), ($this->Y-1));
    if($SQM->isWalkable()) {
      $this->X++;
      $this->Y--;
      return true;
    }
    return false;
  }

  public function goEast()
  {
    /** @var SQM $SQM */
    $SQM = $this->getWorld()->getSQM(($this->X+1), $this->Y);
    if($SQM->isWalkable()) {
      $this->X++;
      return true;
    }
    return false;
  }

  public function goSouthEast()
  {
    /** @var SQM $SQM */
    $SQM = $this->getWorld()->getSQM(($this->X+1), ($this->Y+1));
    if($SQM->isWalkable()) {
      $this->X++;
      $this->Y++;
      return true;
    }
    return false;
  }

  public function goSouth()
  {
    /** @var SQM $SQM */
    $SQM = $this->getWorld()->getSQM($this->X, ($this->Y+1));
    if($SQM->isWalkable()) {
      $this->Y++;
      return true;
    }
    return false;
  }

  public function goSouthWest()
  {
    /** @var SQM $SQM */
    $SQM = $this->getWorld()->getSQM(($this->X-1), ($this->Y+1));
    if($SQM->isWalkable()) {
      $this->X--;
      $this->Y++;
      return true;
    }
    return false;
  }

  public function goWest()
  {
    /** @var SQM $SQM */
    $SQM = $this->getWorld()->getSQM(($this->X-1), $this->Y);
    if($SQM->isWalkable()) {
      $this->X--;
      return true;
    }
    return false;
  }
}