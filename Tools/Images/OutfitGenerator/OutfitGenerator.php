<?php

/**
 * Class OutfitGenerator
 * @author Adam Łożyński
 * @date 2019-11-04
 */

include('AddonDictionary.php');

class OutfitGenerator
{
  const WIDTH = 192;
  const HEIGHT = 256;

  private $OutfitPath = __DIR__ . '/../outfit';
  private $BlendModes;
  private $Images = array();
  private $LookType = array();

  public function __construct()
  {
    $this->BlendModes = new Blendmodes();
  }

  public function generate($params)
  {
    try {
      $this->setupLookType($params);
    }
    catch (Exception $e) {
      die('Caught exception: ' .$e->getMessage());
    }
    $outfit = $this->generateOutfit();
    return $outfit;
  }

  /**
   * @param $params
   * @throws Exception
   */
  private function setupLookType($params)
  {
    if(!is_string($params)) {
      throw new Exception('Wrong looktype!');
    }

    $params = explode(':', $params);
    if(count($params) !== 9) {
      throw new Exception('Wrong looktype!');
    }

    $this->LookType = array(
      'base' => (int) $params[0],
      'head' => (int) $params[1],
      'body' => (int) $params[2],
      'back' => (int) $params[3],
      'hands' => (int) $params[4],
      'head_color' => '#'.$params[5],
      'primary_color' => '#'.$params[6],
      'secondary_color' => '#'.$params[7],
      'detail_color' => '#'.$params[8]
    );

    if(!isset(AddonDictionary::BASE[$this->LookType['base']])) {
      throw new Exception('Unrecognized base!');
    }
    if($this->LookType['head'] != 0 && !isset(AddonDictionary::HEAD[$this->LookType['head']])) {
      throw new Exception('Unrecognized head!');
    }
    if($this->LookType['body'] != 0 && !isset(AddonDictionary::BODY[$this->LookType['body']])) {
      throw new Exception('Unrecognized body!');
    }
    if($this->LookType['back'] != 0 && !isset(AddonDictionary::BACK[$this->LookType['back']])) {
      throw new Exception('Unrecognized back!');
    }
    if($this->LookType['hands'] != 0 && !isset(AddonDictionary::HANDS[$this->LookType['hands']])) {
      throw new Exception('Unrecognized hands!');
    }

    if(!$this->isHexColorValid($this->LookType['head_color'])) {
      throw new Exception('Unrecognized head color!');
    }
    if(!$this->isHexColorValid($this->LookType['primary_color'])) {
      throw new Exception('Unrecognized primary color!');
    }
    if(!$this->isHexColorValid($this->LookType['secondary_color'])) {
      throw new Exception('Unrecognized secondary color!');
    }
    if(!$this->isHexColorValid($this->LookType['detail_color'])) {
      throw new Exception('Unrecognized detail color!');
    }

  }

  private function getColorsToReplace()
  {
    $replace = [];
    foreach(array(
      array('from' => [255,0,0], 'to' => $this->hexToRGB($this->LookType['head_color'])),
      array('from' => [0,255,0], 'to' => $this->hexToRGB($this->LookType['primary_color'])),
      array('from' => [0,0,255], 'to' => $this->hexToRGB($this->LookType['secondary_color'])),
      array('from' => [255,255,0], 'to' => $this->hexToRGB($this->LookType['detail_color'])),
    ) as $color) {
      $col1 = (($color['from'][0] & 0xFF) << 16) + (($color['from'][1] & 0xFF) << 8) + ($color['from'][2] & 0xFF);
      $col2 = (($color['to'][0] & 0xFF) << 16) + (($color['to'][1] & 0xFF) << 8) + ($color['to'][2] & 0xFF);
      $replace[$col1] = $col2;
    }
    return $replace;
  }

  private function generateOutfit()
  {
    $outfit = $this->prepareImage('base', 'real', 1);
    $overlay = $this->prepareImage('base', 'overlay', 1);

    foreach([1,2,3] as $layer) {
      if($this->LookType['body'] > 0 && in_array($layer, AddonDictionary::BODY[$this->LookType['body']]['Layers'])) {
        imagecopy($outfit, $this->prepareImage('body', 'real', $layer), 0, 0, 0, 0, self::WIDTH, self::HEIGHT);
        imagecopy($overlay, $this->prepareImage('body', 'overlay', $layer), 0, 0, 0, 0, self::WIDTH, self::HEIGHT);
      }
      if($this->LookType['hands'] > 0 && in_array($layer, AddonDictionary::HANDS[$this->LookType['hands']]['Layers'])) {
        imagecopy($outfit, $this->prepareImage('hands', 'real', $layer), 0, 0, 0, 0, self::WIDTH, self::HEIGHT);
        imagecopy($overlay, $this->prepareImage('hands', 'overlay', $layer), 0, 0, 0, 0, self::WIDTH, self::HEIGHT);
      }
      if($this->LookType['back'] > 0 && in_array($layer, AddonDictionary::BACK[$this->LookType['back']]['Layers'])) {
        imagecopy($outfit, $this->prepareImage('back', 'real', $layer), 0, 0, 0, 0, self::WIDTH, self::HEIGHT);
        imagecopy($overlay, $this->prepareImage('back', 'overlay', $layer), 0, 0, 0, 0, self::WIDTH, self::HEIGHT);
      }
      if($this->LookType['head'] > 0 && in_array($layer, AddonDictionary::HEAD[$this->LookType['head']]['Layers'])) {
        imagecopy($outfit, $this->prepareImage('head', 'real', $layer), 0, 0, 0, 0, self::WIDTH, self::HEIGHT);
        imagecopy($overlay, $this->prepareImage('head', 'overlay', $layer), 0, 0, 0, 0, self::WIDTH, self::HEIGHT);
      }
    }
    $this->replaceColours($overlay, $this->getColorsToReplace());

    $this->Images['outfit'] = $this->BlendModes->blend($outfit, $overlay, 'multiply');
    return $this->Images['outfit'];
  }

  public function prepareImage($addon, $type, $layer)
  {
    $this->Images[$addon.'_'.$type. '_' .$layer] = imagecreatefrompng($this->OutfitPath. '/' .$addon. '/' .$this->LookType[$addon]. '/' .$layer. '_' .$type. '.png');
    imagealphablending($this->Images[$addon.'_'.$type. '_' .$layer], true);
    imagesavealpha($this->Images[$addon.'_'.$type. '_' .$layer], true);
    return $this->Images[$addon.'_'.$type. '_' .$layer];
  }

  public function __destruct()
  {
    foreach($this->Images as $image) {
      if(is_resource($image)) {
        imagedestroy($image);
      }
    }
  }

  private function replaceColours($img, $replace)
  {
    imagealphablending($img, false);
    $transparent = imagecolortransparent($img);

    if (!imageistruecolor($img)) {
      imagepalettetotruecolor($img);
    }
    for ($x = 0; $x < imagesx($img); $x++) {
      for ($y = 0; $y < imagesy($img); $y++) {
        if(imagecolorat($img, $x, $y) === imagecolorallocate($img,0,0,0)) {
          imagesetpixel($img, $x, $y, $transparent);
        }
        if (array_key_exists($color = imagecolorat($img, $x, $y), $replace)) {
          imagesetpixel($img, $x, $y, $replace[$color]);
        }
      }
    }
    imagealphablending($img, true);
  }

  private function isHexColorValid($hex) {
    preg_match('/^#[0-9A-F]{6}$/i', $hex, $result);
    return count($result) === 1;
  }

  private function hexToRGB($hex) {
    $hex = str_replace('#', '', $hex);
    $split = str_split($hex, 2);
    $r = hexdec($split[0]);
    $g = hexdec($split[1]);
    $b = hexdec($split[2]);
    return [$r,$g,$b];
  }

}