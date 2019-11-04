<?php

include('AddonDictionary.php');

class OutfitGenerator
{
  const HEAD = [255,0,0];
  const PRIMARY = [0,255,0];
  const SECONDARY = [0,0,255];
  const DETAIL = [255,255,0];
  const TRANSPARENT = [255,0,255];

  private $OutfitPath = '../../Data/outfit';
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
    if(count($params) !== 6) {
      throw new Exception('Wrong looktype!');
    }

    $this->LookType = array(
      'outfit' => (int) $params[0],
      'head' => '#'.$params[1],
      'primary' => '#'.$params[2],
      'secondary' => '#'.$params[3],
      'detail' => '#'.$params[4],
      'addon' => (int) $params[5]
    );

    if(!in_array($this->LookType['addon'], AddonDictionary::AVAILABLE)) {
      throw new Exception('Unrecognized addon!');
    }
    if(!$this->isHexColorValid($this->LookType['head'])) {
      throw new Exception('Unrecognized head color!');
    }
    if(!$this->isHexColorValid($this->LookType['primary'])) {
      throw new Exception('Unrecognized primary color!');
    }
    if(!$this->isHexColorValid($this->LookType['secondary'])) {
      throw new Exception('Unrecognized secondary color!');
    }
    if(!$this->isHexColorValid($this->LookType['detail'])) {
      throw new Exception('Unrecognized detail color!');
    }

  }

  private function getColorsToReplace()
  {
    $replace = [];

    $from = self::HEAD;
    $to = $this->hexToRGB($this->LookType['head']);
    $col1 = (($from[0] & 0xFF) << 16) + (($from[1] & 0xFF) << 8) + ($from[2] & 0xFF);
    $col2 = (($to[0] & 0xFF) << 16) + (($to[1] & 0xFF) << 8) + ($to[2] & 0xFF);
    $replace[$col1] = $col2;

    $from = self::PRIMARY;
    $to = $this->hexToRGB($this->LookType['primary']);
    $col1 = (($from[0] & 0xFF) << 16) + (($from[1] & 0xFF) << 8) + ($from[2] & 0xFF);
    $col2 = (($to[0] & 0xFF) << 16) + (($to[1] & 0xFF) << 8) + ($to[2] & 0xFF);
    $replace[$col1] = $col2;

    $from = self::SECONDARY;
    $to = $this->hexToRGB($this->LookType['secondary']);
    $col1 = (($from[0] & 0xFF) << 16) + (($from[1] & 0xFF) << 8) + ($from[2] & 0xFF);
    $col2 = (($to[0] & 0xFF) << 16) + (($to[1] & 0xFF) << 8) + ($to[2] & 0xFF);
    $replace[$col1] = $col2;

    $from = self::DETAIL;
    $to = $this->hexToRGB($this->LookType['detail']);
    $col1 = (($from[0] & 0xFF) << 16) + (($from[1] & 0xFF) << 8) + ($from[2] & 0xFF);
    $col2 = (($to[0] & 0xFF) << 16) + (($to[1] & 0xFF) << 8) + ($to[2] & 0xFF);
    $replace[$col1] = $col2;

    return $replace;
  }

  private function generateOutfit()
  {
    list($width, $height) = getimagesize($this->OutfitPath. '/' .$this->LookType['outfit']. '/base.png');

    // base layers
    $this->Images['outfit_base'] = imagecreatefrompng($this->OutfitPath. '/' .$this->LookType['outfit']. '/base.png');
    imagealphablending($this->Images['outfit_base'], true);
    imagesavealpha($this->Images['outfit_base'], true);
    $outfit = $this->Images['outfit_base'];

    if($this->LookType['addon'] === AddonDictionary::FIRST_ADDON || $this->LookType['addon'] === AddonDictionary::BOTH_ADDONS) {
      $this->Images['addon1_base'] = imagecreatefrompng($this->OutfitPath. '/' .$this->LookType['outfit']. '/addon1.png');
      imagealphablending($this->Images['addon1_base'], true);
      imagesavealpha($this->Images['addon1_base'], true);
      imagecopy($outfit, $this->Images['addon' .AddonDictionary::FIRST_ADDON. '_base'], 0, 0, 0, 0, $width, $height);
    }
    if($this->LookType['addon'] === AddonDictionary::SECOND_ADDON || $this->LookType['addon'] === AddonDictionary::BOTH_ADDONS) {
      $this->Images['addon2_base'] = imagecreatefrompng($this->OutfitPath. '/' .$this->LookType['outfit']. '/addon2.png');
      imagealphablending($this->Images['addon2_base'], true);
      imagesavealpha($this->Images['addon2_base'], true);
      imagecopy($outfit, $this->Images['addon' .AddonDictionary::SECOND_ADDON. '_base'], 0, 0, 0, 0, $width, $height);
    }

    // merge overlay layers
    $this->Images['outfit_overlay'] = imagecreatefrompng($this->OutfitPath. '/' .$this->LookType['outfit']. '/base_overlay.png');
    imagealphablending($this->Images['outfit_overlay'], true);
    imagesavealpha($this->Images['outfit_overlay'], true);
    $outfit_overlay = $this->Images['outfit_overlay'];

    if($this->LookType['addon'] === AddonDictionary::FIRST_ADDON || $this->LookType['addon'] === AddonDictionary::BOTH_ADDONS) {
      $this->Images['addon1_overlay'] = imagecreatefrompng($this->OutfitPath. '/' .$this->LookType['outfit']. '/addon1_overlay.png');
      imagealphablending($this->Images['addon1_overlay'], true);
      imagesavealpha($this->Images['addon1_overlay'], true);
      imagecopy($outfit_overlay, $this->Images['addon' .AddonDictionary::FIRST_ADDON. '_overlay'], 0, 0, 0, 0, $width, $height);
    }
    if($this->LookType['addon'] === AddonDictionary::SECOND_ADDON || $this->LookType['addon'] === AddonDictionary::BOTH_ADDONS) {
      $this->Images['addon2_overlay'] = imagecreatefrompng($this->OutfitPath. '/' .$this->LookType['outfit']. '/addon2_overlay.png');
      imagealphablending($this->Images['addon2_overlay'], true);
      imagesavealpha($this->Images['addon2_overlay'], true);
      imagecopy($outfit_overlay, $this->Images['addon' .AddonDictionary::SECOND_ADDON. '_overlay'], 0, 0, 0, 0, $width, $height);
    }

    $this->replaceColours($this->Images['outfit_overlay'], $this->getColorsToReplace());
    $this->Images['outfit'] = $this->BlendModes->blend($outfit, $outfit_overlay, 'multiply');

    return $this->Images['outfit'];
  }

  public function __destruct()
  {
    $this->destroyImages();
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
        if (array_key_exists($color = imagecolorat($img, $x, $y), $replace)) {
          imagesetpixel($img, $x, $y, $replace[$color]);
        }
        if(imagecolorat($img, $x, $y) === imagecolorallocate($img,0,0,0)) {
          imagesetpixel($img, $x, $y, $transparent);
        }
      }
    }
    imagealphablending($img, true);
  }

  private function destroyImages() {
    foreach($this->Images as $image) {
      if(is_resource($image)) {
        imagedestroy($image);
      }
    }
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