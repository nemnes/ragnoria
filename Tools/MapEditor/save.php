<?php
$world = isset($_POST['world']) ? $_POST['world'] : null;
if($world) {
	$date = date('Y-m-d');
	$time = date('H-m-s');
	mkdir('saved/' .$date. '/');
	$fp = fopen('saved/' .$date. '/' .$time. '.json', 'w');
	fwrite($fp, $world);
	fclose();	
}