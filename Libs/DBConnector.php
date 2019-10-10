<?php

namespace Libs;

use PDO;
use PDOException;

class DBConnector
{
  public $Connection;

  public function __construct($server, $username, $password, $database)
  {
    try {
      $this->Connection = new PDO("mysql:host=$server;dbname=$database", $username, $password);
    } catch (PDOException $e) {
      die($e->getmessage());
    }
  }

  public function getConnection()
  {
    return $this->Connection;
  }

}