<?php
class SaveArea
{
  private $Area;
  private $Map;
  private $BackupMapVersions;

  public function __construct()
  {
    try {
      $this->processRequest();
      $this->saveArea();
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
    if(!isset($_POST['Area']) || !isset($_POST['BackupMapVersions'])) {
      throw new Exception('Bad request arguments (1)');
    }
    $this->Area = @json_decode($_POST['Area'], true);
    $this->BackupMapVersions = $_POST['BackupMapVersions'];

    if($this->Area === null) {
      throw new Exception('Bad request arguments (2)');
    }
    if(!file_exists('map.json')) {
      throw new Exception('Map file not exists!');
    }
    $this->Map = file_get_contents('map.json');
    $this->Map = json_decode($this->Map, true);
    if($this->Map === null) {
      throw new Exception('Map file is corrupted.');
    }
  }

  private function saveArea()
  {
    // clear updated map area before fill (in the case of removed tiles)
    foreach($this->Area as $z => $level) {
      foreach($level as $y => $row) {
        foreach($row as $x => $stack) {
          if(isset($this->Map[$z][$y][$x])) {
            unset($this->Map[$z][$y][$x]);
            if(empty($this->Map[$z][$y])) {
              unset($this->Map[$z][$y]);
            }
            if(empty($this->Map[$z])) {
              unset($this->Map[$z]);
            }
          }
        }
      }
    }

    // fill updated map area
    foreach($this->Area as $z => $level) {
      foreach($level as $y => $row) {
        foreach($row as $x => $stack) {
          if(!empty($stack)) {
            $this->Map[$z][$y][$x] = $stack;
          }
        }
      }
    }

    $fp = fopen('map.json', 'w');
    fwrite($fp, json_encode($this->Map));
    fclose($fp);

    if($this->BackupMapVersions) {
      $copyPath = 'versions/' .date('Y_m_d');
      if (!file_exists($copyPath)) {
        mkdir($copyPath, 0777, true);
      }
      copy('map.json', $copyPath . '/' . date('H_i_s'). '.json');
    }
    echo 'saved successfully';
  }
}
new SaveArea;