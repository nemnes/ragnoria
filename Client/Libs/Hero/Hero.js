var Libs_Hero = {

  Id: null,
  Name: null,
  X: null,
  Y: null,
  Z: null,
  X_Virtual: null,
  Y_Virtual: null,
  Speed: null,
  Direction: null,
  Animation: {
    Playing: false,
    Interval: null,
    CurrentFrame: null
  },
  Altitude: 0,

  init: function(params) {
    Libs_Hero.Id = params.Id;
    Libs_Hero.Name = params.Name;
    Libs_Hero.X = parseInt(params.X);
    Libs_Hero.Y = parseInt(params.Y);
    Libs_Hero.Z = parseInt(params.Z);
    Libs_Hero.X_Virtual = parseInt(params.X);
    Libs_Hero.Y_Virtual = parseInt(params.Y)
    Libs_Hero.Direction = params.Direction;
    Libs_Hero.Speed = parseInt(params.Speed);
    Libs_Hero.Image = new Image;
    Libs_Hero.Image.src = Libs_Misc.getOutfitURL(params);
    Libs_Hero.Image.onload = function() {
      Libs_Loader.reachedMilestone('Hero');
    };
  },

  /** @return {number}*/
  getStepTime: function() {
    return 600-(Libs_Hero.Speed*5.5)+35;
  },

  getTopOffset: function() {
    switch(Libs_Hero.Direction) {
      case 'North': return 64;
      case 'NorthEast': return 128;
      case 'East': return 128;
      case 'SouthEast': return 128;
      case 'South': return 0;
      case 'SouthWest': return 192;
      case 'West': return 192;
      case 'NorthWest': return 192;
      default: return 0;
    }
  },

  getLeftOffset: function() {
    if(!Libs_Hero.Animation.CurrentFrame > 0) {
      return 0;
    }
    return Libs_Hero.Animation.CurrentFrame < 16 ? 64 : 128;
  },

  getTopMargin: function() {
    if(!Libs_Hero.Animation.CurrentFrame > 0) {
      return 0;
    }
    switch(Libs_Hero.Direction) {
      case 'South': return Libs_Hero.Animation.CurrentFrame*(-1);
      case 'North': return Libs_Hero.Animation.CurrentFrame;
      case 'NorthWest': return Libs_Hero.Animation.CurrentFrame;
      case 'NorthEast': return Libs_Hero.Animation.CurrentFrame;
      case 'SouthEast': return Libs_Hero.Animation.CurrentFrame*(-1);
      case 'SouthWest': return Libs_Hero.Animation.CurrentFrame*(-1);
    }
    return 0;
  },

  getLeftMargin: function() {
    if(!(Libs_Hero.Animation.CurrentFrame > 0)) {
      return 0;
    }
    switch(Libs_Hero.Direction) {
      case 'East': return Libs_Hero.Animation.CurrentFrame*(-1);
      case 'West': return Libs_Hero.Animation.CurrentFrame;
      case 'NorthWest': return Libs_Hero.Animation.CurrentFrame;
      case 'NorthEast': return Libs_Hero.Animation.CurrentFrame*(-1);
      case 'SouthEast': return Libs_Hero.Animation.CurrentFrame*(-1);
      case 'SouthWest': return Libs_Hero.Animation.CurrentFrame;
    }
    return 0;
  },

};