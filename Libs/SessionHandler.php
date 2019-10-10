<?php

namespace Libs;

use SessionHandlerInterface;

class SessionHandler implements SessionHandlerInterface
{
  public function close()
  {
    return;
  }

  public function destroy($session_id)
  {
    return;
  }

  public function gc($maxlifetime)
  {
    return;
  }

  public function open($save_path, $name)
  {
    return;
  }

  public function read($session_id)
  {
    return 'test|s:1:"1";Id|s:3:"441";';
  }

  public function write($session_id, $session_data)
  {
    return;
  }
}