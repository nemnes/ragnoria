<?php

namespace Libs;

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
}