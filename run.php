<?php

use Server\App;

ini_set('memory_limit','258M');
require 'vendor/autoload.php';

$app = new App();
include('dependencies.php');
$app->run();