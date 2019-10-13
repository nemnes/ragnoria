<?php

use Libs\DBConnector;
use Pimple\Container;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\Session\SessionProvider;
use Ratchet\WebSocket\WsServer;
use Server\Classes\ItemStructureCollection;
use Server\Classes\World;
use Server\Settings;
use Server\WebsocketEventHandler;

$container = new Container;

$container['PDO'] = function ($c) {
  global $app;
  $app->log('Preparing DB Connection...');
  return new DBConnector(Settings::DATABASE['HOST'], Settings::DATABASE['USERNAME'], Settings::DATABASE['PASSWORD'], Settings::DATABASE['DATABASE']);
};

$container['WebsocketEventHandler'] = function ($c) {
  global $app;
  return new WebsocketEventHandler($app);
};

$container['WsServer'] = function ($c) {
  return new WsServer($c['WebsocketEventHandler']);
};

$container['SessionProvider'] = function ($c) {
  return new SessionProvider($c['WsServer'], new SessionHandler());
};

$container['HttpServer'] = function ($c) {
//  return new HttpServer($c['SessionProvider']);
  return new HttpServer($c['WsServer']);
};

$container['IoServer'] = function ($c) {
  global $app;
  $app->log('Preparing IoServer...');
  $server = IoServer::factory($c['HttpServer'], Settings::SERVER['PORT']);
  $app->log('Preparing Timers...');
  $c['WebsocketEventHandler']->initTimers($server);
  $app->log('Server started!', true);
  return $server;
};

$container['ItemStructureCollection'] = function ($c) {
  global $app;
  return new ItemStructureCollection($app);
};

$container['World'] = function ($c) {
  global $app;
  $app->log('Preparing World...');
  return new World($app);
};