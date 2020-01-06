<?php

namespace Server;

use Libs\MiscHelper;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Server\Classes\Player;

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

    if(!is_array($params)) {
      $this->getApp()->log('Notice: params are not an array!: ' . json_encode($msg));
      return;
    }

    if(!is_string($request) || preg_match('/[^a-z_\-0-9]/i', $request)) {
      $msg = json_encode($request). " is not recognized as an internal command.";
      $this->getApp()->log($msg);
      MiscHelper::sendToClientConsole($from,$msg);
      return;
    }

    $request = ucfirst($request);
    if(!file_exists(Settings::PATH['SERVER']. '/Requests/' .$request. '.php') || $request == 'BaseRequest') {
      $msg = json_encode($request). " is not recognized as an internal command.";
      $this->getApp()->log($msg);
      MiscHelper::sendToClientConsole($from,$msg);
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
        $tblPlayer->X = 150;
        $tblPlayer->Y = 50;
        $tblPlayer->Z = 0;
        $tblPlayer->save();
        $tblPlayer->Name = 'Tester #' .$tblPlayer->Id;
        $tblPlayer->save();

        $tblPlayerSession->load(array('PlayerId = ?', $tblPlayer->Id));
        $tblPlayerSession->PlayerId = $tblPlayer->Id;
        $tblPlayerSession->PHPSESSID = $this->getCookie($conn, 'PHPSESSID');
        $tblPlayerSession->save();
        $conn->send(MiscHelper::prepareResponse('Libs_Misc.refresh'));
      }
      // eo

      return false;
    }
    /** @var Player $player */
    if($player = $this->getApp()->getWorld()->getPlayer($tblPlayerSession->PlayerId)) {
      $this->clients->detach($player->getConnection());
      $player->logout();
    }

    $player = $this->getApp()->newPlayer($tblPlayerSession->PlayerId, $conn);
    $area = $player->getArea();

    $conn->send(MiscHelper::prepareResponse('App.authorization', ['pass', ['hero' =>$player, 'area' => $area, 'players' => $player->getPlayersOnArea(), 'NPCs' => $player->getNPCsOnArea()]]));
    return true;
  }
}