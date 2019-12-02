var Libs_Effect = {

  // login
  1: {frames: 7, speed: 60},
  // logout
  2: {frames: 7, speed: 50},
  // vis
  3: {frames: 7, speed: 65},
  // fire
  4: {frames: 5, speed: 80},

  init: function() {
    Libs_Effect[1].img = new Image();
    Libs_Effect[1].img.src = 'assets/effects/1.png';

    Libs_Effect[2].img = new Image();
    Libs_Effect[2].img.src = 'assets/effects/2.png';

    Libs_Effect[3].img = new Image();
    Libs_Effect[3].img.src = 'assets/effects/3.png';

    Libs_Effect[4].img = new Image();
    Libs_Effect[4].img.src = 'assets/effects/4.png';
  },

  run: function(id,x,y,altitude = 0) {
    if(typeof Libs_Effect[id] !== 'object') {
      return;
    }
    let effect = Libs_Effect[id];
    let unique = Libs_Misc.generateUniqueId();

    Libs_Board.Effects[unique] = {X: parseInt(x), Y: parseInt(y), Id: id, Frame: 0, Altitude: altitude};
    for(let i=1;i<effect.frames;i++) {
      setTimeout(function() {
        Libs_Board.Effects[unique].Frame++;
      }, i*effect.speed);
    }
    setTimeout(function(){
      delete Libs_Board.Effects[unique];
    }, (effect.speed*effect.frames));
  }

};