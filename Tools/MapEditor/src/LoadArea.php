<?php
class LoadArea
{
  private $FromX;
  private $FromY;
  private $ToX;
  private $ToY;
  private $Map;

  public function __construct()
  {
    try {
      $this->processRequest();
      $this->loadArea();
    }
    catch (Exception $e) {
      echo $e->getMessage();
    }
  }

  /**
   * @throws Exception
   */
  private function processRequest()
  {
    if(!isset($_POST['FromX']) || !isset($_POST['FromY']) || !isset($_POST['ToX']) || !isset($_POST['ToY'])) {
      throw new Exception('Bad request arguments (1).');
    }
    if(!is_numeric($_POST['FromX']) || !is_numeric($_POST['FromY']) || !is_numeric($_POST['ToX']) || !is_numeric($_POST['ToY'])) {
      throw new Exception('Bad request arguments (2).');
    }

    if(!file_exists('map.json')) {
      $fp = fopen('map.json', 'w');
      fwrite($fp, json_encode(array()));
      fclose($fp);
    }

    $this->FromX = $_POST['FromX'];
    $this->FromY = $_POST['FromY'];
    $this->ToX = $_POST['ToX'];
    $this->ToY = $_POST['ToY'];

    $this->Map = file_get_contents('map.json');
    $this->Map = json_decode($this->Map, true);
    if($this->Map === null) {
      throw new Exception('Map file is corrupted.');
    }
  }

  private function loadArea()
  {
    $area = array();
    foreach($this->Map as $z => $floor) {
      foreach($floor as $y => $row) {
        if($y < $this->FromY || $y > $this->ToY) {
          continue;
        }
        foreach($row as $x => $stack) {
          if($x < $this->FromX || $x > $this->ToX) {
            continue;
          }
          $area[$z][$y][$x] = $stack;
        }
      }
    }
    echo json_encode($area);
  }

}
new LoadArea;