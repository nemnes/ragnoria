var Libs_Effect = {

  // login
  1: {frames: 7, speed: 60},

  run: function(id,x,y) {
    if(typeof Libs_Effect[id] !== 'object') {
      return;
    }
    x = parseInt(x);
    y = parseInt(y);
    var effect = Libs_Effect[id];
    var $sqm = Libs_Board.getSQM(x,y);
    var $effect = $('<div class="effect" style="z-index: ' +y+''+(x+1)+'; background-image: url(assets/effects/' +id+ '.png);"></div>');
    $sqm.append($effect);

    for(let i=1;i<effect.frames;i++) {
      setTimeout(function() { $effect.css('background-position-x', (i*-1)*32+ 'px'); }, i*effect.speed);
    }

    setTimeout(function(){
      $effect.remove();
    }, (effect.speed*effect.frames));
  }

};