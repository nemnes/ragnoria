var Libs_Effect = {

  Amount: 4,
  Loaded: 0,

  // login/vis
  1: {frames: 8, speed: 60},
  // logout
  2: {frames: 7, speed: 50},
  // mort
  3: {frames: 8, speed: 60},
  // fire
  4: {frames: 5, speed: 80},

  init: function() {
    for(let i = 1; i<= Libs_Effect.Amount; i++) {
      Libs_Effect[i].img = new Image();
      Libs_Effect[i].img.src = 'assets/effects/' +i+ '.png';
      Libs_Effect[i].img.onload = Libs_Effect.onImageLoaded;
    }
  },

  onImageLoaded: function() {
    Libs_Effect.Loaded++;
    if(Libs_Effect.Loaded === Libs_Effect.Amount) {
      Libs_Loader.reachedMilestone('Effects');
    }
  },

  run: function(id,x,y,onCreature = false) {
    if(typeof Libs_Effect[id] !== 'object') {
      return;
    }
    let altitude = onCreature ? 6 : 0;
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