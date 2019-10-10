<?php

namespace Server;

use Libs\MiscHelper;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class WebsocketEventHandler implements MessageComponentInterface
{
  protected $clients;
  private $App;

  public function __construct(App $App)
  {
    $this->App = $App;
    $this->clients = new \SplObjectStorage;
  }

  public function getApp()
  {
    return $this->App;
  }

  public function onOpen(ConnectionInterface $conn)
  {
    $this->clients->attach($conn);
    if(!$this->authorize($conn)) {
      $conn->close();
      return false;
    }
    return true;
  }

  public function onMessage(ConnectionInterface $from, $msg)
  {
    if(!isset($from->Player)) {
      $this->getApp()->log('Notice: message sent by unknown player!');
      return;
    }

    $msg = json_decode($msg);
    if(!is_array($msg)) {
      $this->getApp()->log('Notice: onMessage argument is not an array!: ' . json_encode($msg));
      return;
    }

    $request = $msg[0];
    $params = isset($msg[1]) ? $msg[1] : array();

    if(!is_string($request) || preg_match('/[^a-z_\-0-9]/i', $request)) {
      $this->getApp()->log('Notice: unexpected request: ' . json_encode($request));
      return;
    }
    if(!file_exists(Settings::PATH['SERVER']. '/Requests/' .$request. '.php')) {
      $this->getApp()->log('Notice: trying to call unknown request: ' . json_encode($request));
      return;
    }

    $request = __NAMESPACE__  . '\\Requests\\' .$request;
    $params = array_merge(array($from->Player), $params);
    if(class_exists($request)) {
      new $request($this->getApp(), $params);
    }
    else {
      $this->getApp()->log('Class not found: ' . $request);
    }
    return;
  }

  public function onClose(ConnectionInterface $conn)
  {
    if(isset($conn->Player)) {
      $conn->Player->logout();
    }
    $this->clients->detach($conn);
  }

  public function onError(ConnectionInterface $conn, \Exception $e)
  {
    $tblError = $this->getApp()->getSQLMapper('tblError');
    $tblError->Message = $e->getMessage();
    $tblError->DateTime = date('Y-m-d H:i:s');
    if(isset($conn->Player)) {
      $tblError->PlayerId = $conn->Player->Id;
    }
    $tblError->save();
    $this->getApp()->log("Error occured. Details saved in database error log.");
    $conn->close();
  }

  public function initTimers($server)
  {
    foreach(glob(Settings::PATH['SERVER'] . '/Timers/*.php') as $timer) {
      if(pathinfo($timer)['filename'] == 'BaseTimer') {
        continue;
      }
      $timer = __NAMESPACE__  . '\\Timers\\' . pathinfo($timer)['filename'];
      new $timer($this->getApp(), $server);
    }
  }

  public function getCookies($conn)
  {
    $cookies = $conn->httpRequest->getHeader('Cookie');
    $cookies = count($cookies) ? \GuzzleHttp\Psr7\parse_header($cookies)[0] : [];
    return $cookies;
  }

  public function getCookie($conn, $name)
  {
    $cookies = $this->getCookies($conn);
    if(isset($cookies[$name])) {
      return $cookies[$name];
    }
    return null;
  }

  private function authorize(ConnectionInterface $conn)
  {
    $tblPlayerSession = $this->getApp()->getSQLMapper('tblPlayerSession');
    if(!$tblPlayerSession->load(array('PHPSESSID = ?', $this->getCookie($conn, 'PHPSESSID')))) {
      $conn->send(MiscHelper::prepareResponse('App.authorization', ['fail']));

      // only for debug purposes
      if($this->getCookie($conn, 'PHPSESSID')) {
        $tblPlayer = $this->getApp()->getSQLMapper('tblPlayer');
        $tblPlayer->Name = 'Tester';
        $tblPlayer->X = 23;
        $tblPlayer->Y = 23;
        $tblPlayer->save();
        $tblPlayer->Name = 'Tester #' .$tblPlayer->Id;
        $tblPlayer->save();

        $tblPlayerSession->load(array('PlayerId = ?', $tblPlayer->Id));
        $tblPlayerSession->PlayerId = $tblPlayer->Id;
        $tblPlayerSession->PHPSESSID = $this->getCookie($conn, 'PHPSESSID');
        $tblPlayerSession->save();
      }
      // eo

      return false;
    }
    if($player = $this->getApp()->getWorld()->getPlayer($tblPlayerSession->PlayerId)) {
      $this->clients->detach($player->getConnection());
      $player->logout();
    }

    $player = $this->getApp()->newPlayer($tblPlayerSession->PlayerId, $conn);
    $area = $player->getArea();

    $conn->send(MiscHelper::prepareResponse('App.authorization', ['pass', ['player' =>$player, 'area' => $area]]));
    return true;
  }
}