var Libs_Hero = {
  $: null,
  Id: null,
  Name: null,
  X: null,
  Y: null,
  Speed: null,

  /** @return {number}*/
  StepTime: function() {
    return 600-(Libs_Hero.Speed*5.5)+25;
  },

  movementBlocked: false,
  walkingAnimation: false,
  walking: false,

  init: function(params) {
    Libs_Hero.Id = params.Id;
    Libs_Hero.Name = params.Name;
    Libs_Hero.X = parseInt(params.X);
    Libs_Hero.Y = parseInt(params.Y);
    Libs_Hero.Speed = parseInt(25);
    Libs_Hero.$ = $('<div id="Hero" style="z-index: ' +params.Y+ '' +params.X+ '"><div class="nickname">' +params.Name+ '</div></div>');
    $('.sqm[data-x="' +Libs_Hero.X+ '"][data-y="' +Libs_Hero.Y+ '"]').append(Libs_Hero.$);
  },

  rotate: function(dir) {
    switch(dir) {
      case 'North':
        Libs_Hero.$.css('background-position-y', -64+'px');
        break;
      case 'South':
        Libs_Hero.$.css('background-position-y', '0px');
        break;
      case 'East':
        Libs_Hero.$.css('background-position-y', -128+'px');
        break;
      case 'West':
        Libs_Hero.$.css('background-position-y', -192+'px');
        break;
    }
  },

  confirmStep: function(positive, X, Y, area) {
    var waitInt = setInterval(function(){
      if(Libs_Hero.walking === false) {
        clearInterval(waitInt);
        if(positive) {

          Libs_Hero.X = parseInt(X);
          Libs_Hero.Y = parseInt(Y);

          var areaWidth = Object.keys(area[Object.keys(area)[0]]).length;
          var areaHeight = Object.keys(area).length;
          var y_range_first = Libs_Hero.Y-Math.floor(areaHeight/2);
          var y_range_last = (y_range_first+areaHeight)-1;
          var x_range_first = Libs_Hero.X-Math.floor(areaWidth/2);
          var x_range_last = (x_range_first+areaWidth)-1;

          // find map-rows to add
          var mapRowsToAdd = [];
          for(let i = y_range_first;i<=y_range_last;i++) {
            if(Libs_Board.$.find('.map-row[data-y="'+i+'"]').length === 0) {
              mapRowsToAdd.push(i);
            }
          }

          // find map-rows to remove
          var mapRowsToRemove = [];
          var y_min_atm;
          var y_max_atm;
          Libs_Board.$.find('.map-row').each(function(){
            if($(this).data('y') > y_range_last || $(this).data('y') < y_range_first) {
              mapRowsToRemove.push($(this));
            }
            y_min_atm = !y_min_atm || $(this).data('y') < y_min_atm ? $(this).data('y') : y_min_atm;
            y_max_atm = !y_max_atm || $(this).data('y') > y_max_atm ? $(this).data('y') : y_max_atm;
          });

          // create new map-rows
          for(let i in mapRowsToAdd) {
            var mapRowY = mapRowsToAdd[i];
            var $newRow = $('<div class="map-row" data-y="' +mapRowY+ '"></div>');
            if(Libs_Board.$.find('.map-row[data-y="' +(mapRowY+1)+ '"]').length > 0) {
              Libs_Board.$.find('.map-row[data-y="' +(mapRowY+1)+ '"]').before($newRow);
              continue;
            }
            if(Libs_Board.$.find('.map-row[data-y="' +(mapRowY-1)+ '"]').length > 0) {
              Libs_Board.$.find('.map-row[data-y="' +(mapRowY-1)+ '"]').after($newRow);
              continue;
            }
            if(y_min_atm && mapRowY < y_min_atm) {
              Libs_Board.$.find('.map-row[data-y="' +y_min_atm+ '"]').before($newRow);
              continue;
            }
            if(y_max_atm && mapRowY > y_max_atm) {
              Libs_Board.$.find('.map-row[data-y="' +y_max_atm+ '"]').after($newRow);
              continue;
            }
            Libs_Board.$.append($newRow);
          }

          for (var [area_y, row] of Object.entries(area)) {
            for (var [area_x, sqm] of Object.entries(row)) {
              area_x = parseInt(area_x);
              area_y = parseInt(area_y);
              if(Libs_Board.$.find('.sqm[data-x="' +area_x+ '"][data-y="' +area_y+ '"]').length > 0) {
                continue;
              }
              var $newSQM = Libs_Board.setSQM(sqm,area_x,area_y);
              if(Libs_Board.$.find('.sqm[data-x="' +(area_x+1)+ '"][data-y="' +area_y+ '"]').length > 0) {
                Libs_Board.$.find('.sqm[data-x="' +(area_x+1)+ '"][data-y="' +area_y+ '"]').before($newSQM);
                continue;
              }
              if(Libs_Board.$.find('.sqm[data-x="' +(area_x-1)+ '"][data-y="' +area_y+ '"]').length > 0) {
                Libs_Board.$.find('.sqm[data-x="' +(area_x-1)+ '"][data-y="' +area_y+ '"]').after($newSQM);
                continue;
              }
              Libs_Board.$.find('.map-row[data-y="' +area_y+ '"]').append($newSQM);
            }
          }

          for(let i in mapRowsToRemove) {
            mapRowsToRemove[i].remove();
          }

          Libs_Board.$.find(".map-row[data-y='" +Y+ "'] .sqm[data-x='" +X+ "'][data-y='" +Y+ "']").prepend(Libs_Hero.$);
        }
        Libs_Board.$.find('.sqm').each(function(){
          if(typeof area[parseInt($(this).data('y'))][parseInt($(this).data('x'))] == 'undefined') {
            $(this).remove();
          }
        });
        Libs_Board.$.css('margin-top', '0').css('margin-left', '0');
        Libs_Hero.$.css('top', '0').css('left', '0');
        Libs_Hero.movementBlocked = false;
      }
    }, 10);
  },

  go: function (direction) {
    Libs_Hero.movementBlocked = true;
    Libs_Hero.walking = true;
    Libs_Hero.rotate(direction);
    Libs_Hero.startWalkingAnimation(Libs_Hero.StepTime());

    setTimeout(function(){
      if(direction === 'North') Libs_Hero.$.css('z-index', (Libs_Hero.Y-1) +''+(Libs_Hero.X));
      if(direction === 'South') Libs_Hero.$.css('z-index', (Libs_Hero.Y+1) +''+(Libs_Hero.X));
      if(direction === 'East') Libs_Hero.$.css('z-index', (Libs_Hero.Y) +''+(Libs_Hero.X+1));
      if(direction === 'West') Libs_Hero.$.css('z-index', (Libs_Hero.Y) +''+(Libs_Hero.X-1));
    }, Libs_Hero.StepTime()/2);

    if(direction === 'North') {
      Libs_Board.$.finish().animate({ marginTop: '64px' }, Libs_Hero.StepTime(), 'linear');
      Libs_Hero.$.finish().animate({ top: '-32px' }, Libs_Hero.StepTime(), 'linear', function(){
        Libs_Hero.stopWalkingAnimation();
      });
    }
    if(direction === 'South') {
      Libs_Board.$.finish().animate({ marginTop: '-64px' }, Libs_Hero.StepTime(), 'linear');
      Libs_Hero.$.finish().animate({ top: '32px' }, Libs_Hero.StepTime(), 'linear', function(){
        Libs_Hero.stopWalkingAnimation();
      });
    }
    if(direction === 'East') {
      Libs_Board.$.finish().animate({ marginLeft: '-64px' }, Libs_Hero.StepTime(), 'linear');
      Libs_Hero.$.finish().animate({ left: '32px' }, Libs_Hero.StepTime(), 'linear', function(){
        Libs_Hero.stopWalkingAnimation();
      });
    }
    if(direction === 'West') {
      Libs_Board.$.finish().animate({ marginLeft: '64px' }, Libs_Hero.StepTime(), 'linear');
      Libs_Hero.$.finish().animate({ left: '-32px' }, Libs_Hero.StepTime(), 'linear', function(){
        Libs_Hero.stopWalkingAnimation();
      });
    }
  },

  startWalkingAnimation: function(stepTime) {
    clearTimeout(Libs_Hero.walkingAnimation);
    clearInterval(Libs_Hero.walkingAnimation);
    Libs_Hero.$.css('background-position-x', -2*64+'px');
    Libs_Hero.walkingAnimation = setInterval(function(){
      if(Libs_Hero.$.css('background-position-x') === '-128px') {
        Libs_Hero.$.css('background-position-x', -1*64+'px');
      }
      else {
        Libs_Hero.$.css('background-position-x', -2*64+'px');
      }
    }, (stepTime/2)+25);
  },

  stopWalkingAnimation: function() {
    clearTimeout(Libs_Hero.walkingAnimation);
    clearInterval(Libs_Hero.walkingAnimation);
    Libs_Hero.walking = false;

    Libs_Hero.walkingAnimation = setTimeout(function(){
      Libs_Hero.$.css('background-position-x', '0px');
      Libs_Hero.walkingAnimation = false;
    }, 25);
  },


};