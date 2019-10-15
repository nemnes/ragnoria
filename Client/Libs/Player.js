class Player {

  movementBlocked = false;
  walkingAnimation = false;

  constructor(params) {
    this.Id = params.Id;
    this.Name = params.Name;
    this.X = parseInt(params.X);
    this.Y = parseInt(params.Y);
  }

  goNorth(area, speed) {
    var _self = App.MyPlayer;
    var stepTime = 600-(speed*5.5)+25;
    var areaWidth = Object.keys(area[Object.keys(area)[0]]).length;
    var areaHeight = Object.keys(area).length;
    _self.movementBlocked = true;
    _self.Y--;

    var $hero = $('#Hero', document);
    $hero.css('background-position-y', -64+'px').css('top', '32px');
    _self.startWalkingAnimation(stepTime);

    var $newRow = $('<div class="map-row" data-y="' +(_self.Y-Math.floor(areaHeight/2))+ '"></div>');
    for(var x=parseInt(_self.X)-Math.floor(areaWidth/2);x<parseInt(_self.X)+Math.ceil(areaWidth/2);x++) {
      var y = _self.Y-Math.floor(areaHeight/2);
      var sqm = area[y][x];
      if(!sqm) {
        continue;
      }
      var $newSQM = Libs_Board.setSQM(sqm,x,y);
      $newRow.append($newSQM);
    }
    $newRow.css('margin-top', '-32px').css('opacity', '0');

    $("#map .map-row[data-y='" +(_self.Y-(Math.floor(areaHeight/2)-1))+ "']").before($newRow.finish().animate({marginTop: '0'}, stepTime, 'linear', function() {$(this).css('opacity', '1'); }));
    $("#map .map-row[data-y='" +(_self.Y)+ "'] .sqm[data-x='" +(_self.X)+ "'][data-y='" +(_self.Y)+ "']").append($hero);

    setTimeout(function(){
      $hero.css('z-index', _self.Y +''+_self.X);
    }, stepTime/2);
    $hero.finish().animate({ top: 0 }, stepTime, 'linear');
    $("#map .map-row").last().css('opacity', '0').finish().animate({ marginTop: '-32px' }, stepTime, 'linear', function(){
      $(this).remove();
      _self.movementBlocked = false;
      _self.stopWalkingAnimation();
    });
  }

  goSouth(area, speed) {
    var _self = App.MyPlayer;
    var stepTime = 600-(speed*5.5)+25;
    var areaWidth = Object.keys(area[Object.keys(area)[0]]).length;
    var areaHeight = Object.keys(area).length;
    _self.movementBlocked = true;
    _self.Y++;

    var $hero = $('#Hero', document);
    $hero.css('background-position-y', '0px').css('top', '-32px');
    _self.startWalkingAnimation(stepTime);

    var $newRow = $('<div class="map-row" data-y="' +(_self.Y+Math.floor(areaHeight/2))+ '"></div>');
    for(var x=parseInt(_self.X)-Math.floor(areaWidth/2);x<parseInt(_self.X)+Math.ceil(areaWidth/2);x++) {
      var y = _self.Y+Math.floor(areaHeight/2);
      var sqm = area[y][x];
      if(!sqm) {
        continue;
      }
      var $newSQM = Libs_Board.setSQM(sqm,x,y);
      $newRow.append($newSQM);
    }
    $newRow.css('margin-top', '-32px').css('opacity', '0');

    $("#map .map-row[data-y='" +(_self.Y+(Math.floor(areaHeight/2)-1))+ "']").after($newRow.finish().animate({marginTop: '0'}, stepTime, 'linear', function() {$(this).css('opacity', '1'); }));
    $("#map .map-row[data-y='" +(_self.Y)+ "'] .sqm[data-x='" +(_self.X)+ "'][data-y='" +(_self.Y)+ "']").append($hero);

    setTimeout(function(){
      $hero.css('z-index', _self.Y +''+_self.X);
    }, stepTime/2);
    $hero.finish().animate({ top: 0 }, stepTime, 'linear');
    $("#map .map-row").first().css('opacity', '0').finish().animate({ marginTop: '-32px' }, stepTime, 'linear', function(){
      $(this).remove();
      _self.movementBlocked = false;
      _self.stopWalkingAnimation();
    });
  }

  goEast(area, speed) {
    var _self = App.MyPlayer;
    var stepTime = 600-(speed*5.5)+25;
    var areaWidth = Object.keys(area[Object.keys(area)[0]]).length;
    var areaHeight = Object.keys(area).length;
    _self.movementBlocked = true;
    _self.X++;

    var $hero = $('#Hero', document);
    $hero.css('background-position-y', -128+'px').css('left', '-32px');
    _self.startWalkingAnimation(stepTime);

    for(var y = parseInt(_self.Y)-Math.floor(areaHeight/2); y<parseInt(_self.Y)+Math.ceil(areaHeight/2);y++) {
      var x = parseInt(_self.X)+Math.floor(areaWidth/2);
      var sqm = area[y][x];
      if(!sqm) {
        continue;
      }
      $('.map-row[data-y="' +y+ '"] div.sqm[data-x="' + (parseInt(_self.X)-Math.ceil(areaWidth/2)) + '"', document).css('opacity', '0').finish().animate({marginLeft: '-32px'}, stepTime, 'linear', function(){
        $(this).remove();
      });
      $('.map-row[data-y="' +y+ '"] div.sqm[data-x="' + x + '"', document).remove();
      var $newSQM = Libs_Board.setSQM(sqm,x,y);
      $newSQM.css('margin-left', '-32px').css('opacity', '0');
      $('.map-row[data-y="' +y+ '"]', document).append($newSQM.finish().animate({marginLeft: '0px'}, stepTime, 'linear', function(){ $(this).css('opacity', '1'); }));
    }
    $("#map .map-row[data-y='" +(_self.Y)+ "'] .sqm[data-x='" +(_self.X)+ "'][data-y='" +(_self.Y)+ "']").append($hero);

    setTimeout(function(){
      $hero.css('z-index', _self.Y +''+_self.X);
    }, stepTime/2);
    $hero.finish().animate({ left: 0 }, stepTime, 'linear', function(){
      _self.movementBlocked = false;
      _self.stopWalkingAnimation();
    });
  }

  goWest(area, speed) {
    var _self = App.MyPlayer;
    var stepTime = 600-(speed*5.5)+25;
    var areaWidth = Object.keys(area[Object.keys(area)[0]]).length;
    var areaHeight = Object.keys(area).length;
    _self.movementBlocked = true;
    _self.X--;

    var $hero = $('#Hero', document);
    $hero.css('background-position-y', -192+'px').css('left', '32px');
    _self.startWalkingAnimation(stepTime);

    for(var y = parseInt(_self.Y)-Math.floor(areaHeight/2); y<parseInt(_self.Y)+Math.ceil(areaHeight/2);y++) {
      var x = parseInt(_self.X)-Math.floor(areaWidth/2);
      var sqm = area[y][x];
      if(!sqm) {
        continue;
      }
      $('.map-row[data-y="' +y+ '"] div.sqm[data-x="' + (parseInt(_self.X)+Math.ceil(areaWidth/2)) + '"', document).css('opacity', '0').finish().animate({marginLeft: '-32px'}, stepTime, 'linear', function(){
        $(this).remove();
      });
      $('.map-row[data-y="' +y+ '"] div.sqm[data-x="' + x + '"', document).remove();
      var $newSQM = Libs_Board.setSQM(sqm,x,y);
      $newSQM.css('margin-left', '-32px').css('opacity', '0');
      $('.map-row[data-y="' +y+ '"]', document).prepend($newSQM.finish().animate({marginLeft: '0px'}, stepTime, 'linear', function(){ $(this).css('opacity', '1'); }));
    }
    $("#map .map-row[data-y='" +(_self.Y)+ "'] .sqm[data-x='" +(_self.X)+ "'][data-y='" +(_self.Y)+ "']").append($hero);


    setTimeout(function(){
      $hero.css('z-index', _self.Y +''+_self.X);
    }, stepTime/2);
    $hero.finish().animate({ left: 0 }, stepTime, 'linear', function(){
      _self.movementBlocked = false;
      _self.stopWalkingAnimation();
    });
  }

  startWalkingAnimation(stepTime) {
    var _self = App.MyPlayer;
    clearTimeout(_self.walkingAnimation);
    clearInterval(_self.walkingAnimation);
    $('#Hero').css('background-position-x', -2*64+'px');
    _self.walkingAnimation = setInterval(function(){
      if($('#Hero').css('background-position-x') === '-128px') {
        $('#Hero').css('background-position-x', -1*64+'px');
      }
      else {
        $('#Hero').css('background-position-x', -2*64+'px');
      }
    }, (stepTime/2)+25);
  }

  stopWalkingAnimation() {
    var _self = App.MyPlayer;
    clearTimeout(_self.walkingAnimation);
    clearInterval(_self.walkingAnimation);
    _self.walkingAnimation = setTimeout(function(){
      $('#Hero').css('background-position-x', '0px');
    }, 50);
  }



}