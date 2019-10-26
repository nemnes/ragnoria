var Libs_Player = {

  Player: [],

  create: function(player) {
    if(Libs_Board.$.find('.player[data-id="' +player.Id+ '"]').length > 0) {
      return;
    }
    let $player = $('<div class="player" data-id="' +player.Id+ '" data-nickname="' +player.Name+ '" style="z-index: ' +player.Y+ '' +player.X+ '"><div class="nickname">' +player.Name+ '</div></div>');
    Libs_Board.$.find('.sqm[data-x="' +player.X+ '"][data-y="' +player.Y+ '"]').append($player);
  },

  move: function(player, direction) {
    if(Libs_Board.$.find('.player[data-id="' +player.Id+ '"]').length === 0) {
      Libs_Player.create(player);
      Libs_Player.rotate(player.Id, direction);
    }
    else {
      Libs_Player.rotate(player.Id, direction);
      let $player = Libs_Board.$.find('.player[data-id="' +player.Id+ '"]');
      let stepTime = (600-(25*5.5)+25);
      Libs_Player.startWalkingAnimation(player.Id, stepTime);

      setTimeout(function(){
        if(direction === 'North') $player.css('z-index', (player.Y) +''+(player.X));
        if(direction === 'South') $player.css('z-index', (player.Y) +''+(player.X));
        if(direction === 'East') $player.css('z-index', (player.Y) +''+(player.X));
        if(direction === 'West') $player.css('z-index', (player.Y) +''+(player.X));
      }, stepTime/2);

      if(direction === 'North') {
        $player.finish().animate({ top: '-32px' }, Libs_Hero.StepTime(), 'linear', function(){
          $player.css('top', '0px').css('left', '0px');
          Libs_Board.$.find('.sqm[data-x="' +player.X+ '"][data-y="' +player.Y+ '"]').append($player);
          Libs_Player.stopWalkingAnimation(player.Id);
        });
      }
      if(direction === 'South') {
        $player.finish().animate({ top: '32px' }, Libs_Hero.StepTime(), 'linear', function(){
          $player.css('top', '0px').css('left', '0px');
          Libs_Board.$.find('.sqm[data-x="' +player.X+ '"][data-y="' +player.Y+ '"]').append($player);
          Libs_Player.stopWalkingAnimation(player.Id);
        });
      }
      if(direction === 'East') {
        $player.finish().animate({ left: '32px' }, Libs_Hero.StepTime(), 'linear', function(){
          $player.css('top', '0px').css('left', '0px');
          Libs_Board.$.find('.sqm[data-x="' +player.X+ '"][data-y="' +player.Y+ '"]').append($player);
          Libs_Player.stopWalkingAnimation(player.Id);
        });
      }
      if(direction === 'West') {
        $player.finish().animate({ left: '-32px' }, Libs_Hero.StepTime(), 'linear', function(){
          $player.css('top', '0px').css('left', '0px');
          Libs_Board.$.find('.sqm[data-x="' +player.X+ '"][data-y="' +player.Y+ '"]').append($player);
          Libs_Player.stopWalkingAnimation(player.Id);
        });
      }
    }

  },

  remove: function(id) {
    Libs_Board.$.find('.player[data-id="' +id+ '"]').finish().remove();
  },

  rotate: function(id, direction) {
    let $player = $('.player[data-id="' +id+ '"]');
    switch(direction) {
      case 'North':
        $player.css('background-position-y', -64+'px');
        break;
      case 'South':
        $player.css('background-position-y', '0px');
        break;
      case 'East':
        $player.css('background-position-y', -128+'px');
        break;
      case 'West':
        $player.css('background-position-y', -192+'px');
        break;
    }
  },

  startWalkingAnimation(id, stepTime) {
    if(!Libs_Player.Player[id]) { Libs_Player.Player[id] = {};}
    clearTimeout(Libs_Player.Player[id].walkingAnimation);
    clearInterval(Libs_Player.Player[id].walkingAnimation);
    let $player = Libs_Board.$.find('.player[data-id="' +id+ '"]');
    $player.finish().css('background-position-x', -2*64+'px');
    Libs_Player.Player[id].walkingAnimation = setInterval(function(){
      if($player.css('background-position-x') === '-128px') {
        $player.css('background-position-x', -1*64+'px');
      }
      else {
        $player.css('background-position-x', -2*64+'px');
      }
    }, (stepTime/2)+25);
  },

  stopWalkingAnimation: function(id) {
    if(!Libs_Player.Player[id]) { Libs_Player.Player[id] = {};}
    clearTimeout(Libs_Player.Player[id].walkingAnimation);
    clearInterval(Libs_Player.Player[id].walkingAnimation);
    Libs_Player.Player[id].walking = false;
    let $player = Libs_Board.$.find('.player[data-id="' +id+ '"]');
    Libs_Player.Player[id].walkingAnimation = setTimeout(function(){
      $player.css('background-position-x', '0px');
    }, 50);
  },


};