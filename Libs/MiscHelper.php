<?php

namespace Libs;

use Ratchet\ConnectionInterface;

class MiscHelper
{
  static function copyObjectProperties($from, $to)
  {
    foreach($from as $field => $val) {
      $to->{$field} = $val;
    }
  }

  static function prepareResponse($method, $params = array())
  {
    return json_encode(array($method, $params));
  }

  static function sendToClientConsole(ConnectionInterface $from, $msg, $level = 'default')
  {
    $from->send(MiscHelper::prepareResponse('Libs_Console.addLog', array(array('msg' => $msg, 'level' => $level))));
  }
}