var Libs_Player = {

  create: function(player) {
    if(typeof Libs_Board.Players[player.Id] !== 'undefined') {
      return;
    }
    player.Image = new Image;
    player.Image.src = Libs_Misc.getOutfitURL(player);
    player.Animation = {
      Playing: false,
      CurrentFrame: null
    };
    Libs_Board.Players[player.Id] = player;
  },

  move: function(player, direction = false) {
    if(!(Libs_Board.Players[player.Id])) {
      Libs_Player.create(player);
      return;
    }
    Libs_Board.Players[player.Id].X = player.X;
    Libs_Board.Players[player.Id].Y = player.Y;
    Libs_Board.Players[player.Id].Direction = player.Direction;
    if(direction) {

      Libs_Board.Players[player.Id].Animation.CurrentFrame = 0;
      Libs_Board.Players[player.Id].Animation.Playing = true;

      /** OPTION 1 - setInterval */
      // App.clearInterval('Player_' +player.Id+ '_Movement');
      // App.addInterval('Player_' +player.Id+ '_Movement', function() {
      //   if(typeof Libs_Board.Players[player.Id] === 'undefined') {
      //     App.clearInterval('Player_' +player.Id+ '_Movement');
      //     return;
      //   }
      //   Libs_Board.Players[player.Id].Animation.CurrentFrame++;
      //   if(Libs_Board.Players[player.Id].Animation.CurrentFrame === 32) {
      //     App.clearInterval('Player_' +player.Id+ '_Movement');
      //     Libs_Board.Players[player.Id].Animation.CurrentFrame = null;
      //     Libs_Board.Players[player.Id].Animation.Playing = false;
      //   }
      // }, (Libs_Player.getStepTime(player.Id)/32));

      /** OPTION 2 - setTimeout in loop */
      for(let i = 1; i <= 32; i++) {
        App.clearTimeout('Player_' +player.Id+ '_Movement_' + i);
      }
      for(let i = 1; i <= 32; i++) {
        App.addTimeout('Player_' +player.Id+ '_Movement_' + i, function(){
          if(typeof Libs_Board.Players[player.Id] === 'undefined') {
            return;
          }
          Libs_Board.Players[player.Id].Animation.CurrentFrame++;
          if(Libs_Board.Players[player.Id].Animation.CurrentFrame === 32) {
            Libs_Board.Players[player.Id].Animation.CurrentFrame = null;
            Libs_Board.Players[player.Id].Animation.Playing = false;
          }
        }, (Libs_Hero.getStepTime()/32)*i);
      }
    }

  },

  rotate: function(id, direction) {
    Libs_Board.Players[id].Direction = direction;
  },

  remove: function(id) {
    if(Libs_Board.Players[id]) {
      delete Libs_Board.Players[id];
    }
  },

  updateFromList: function(players) {
    for(let playerId in Libs_Board.Players) if (Libs_Board.Players.hasOwnProperty(playerId)) {
      if(typeof players[playerId] === 'undefined') {
        Libs_Player.remove(playerId);
      }
    }
    for(let playerId in players) if (players.hasOwnProperty(playerId)) {
      if(typeof Libs_Board.Players[playerId] === 'undefined') {
        Libs_Player.create(players[playerId]);
      }
    }
  },

  getStepTime: function(id) {
    return 600-(Libs_Board.Players[id].Speed*5.5)+35;
  },

  getTopOffset: function(id) {
    switch(Libs_Board.Players[id].Direction) {
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

  getLeftOffset: function(id) {
    if(!Libs_Board.Players[id].Animation.Playing) {
      return 0;
    }
    return Libs_Board.Players[id].Animation.CurrentFrame < 16 ? 64 : 128;
  },


  getTopMargin: function(id) {
    if(!Libs_Board.Players[id].Animation.Playing) {
      return 0;
    }
    if(Libs_Board.Players[id].Animation.CurrentFrame < 16) {
      switch(Libs_Board.Players[id].Direction) {
        case 'South': return Libs_Board.Players[id].Animation.CurrentFrame;
        case 'North': return Libs_Board.Players[id].Animation.CurrentFrame*(-1);
        case 'NorthWest': return Libs_Board.Players[id].Animation.CurrentFrame*(-1);
        case 'NorthEast': return Libs_Board.Players[id].Animation.CurrentFrame*(-1);
        case 'SouthEast': return Libs_Board.Players[id].Animation.CurrentFrame;
        case 'SouthWest': return Libs_Board.Players[id].Animation.CurrentFrame;
        default: return 0;
      }
    }
    else {
      switch(Libs_Board.Players[id].Direction) {
        case 'South': return Libs_Board.Players[id].Animation.CurrentFrame-32;
        case 'North': return Libs_Board.Players[id].Animation.CurrentFrame*(-1)+32;
        case 'NorthWest': return Libs_Board.Players[id].Animation.CurrentFrame*(-1)+32;
        case 'NorthEast': return Libs_Board.Players[id].Animation.CurrentFrame*(-1)+32;
        case 'SouthEast': return Libs_Board.Players[id].Animation.CurrentFrame-32;
        case 'SouthWest': return Libs_Board.Players[id].Animation.CurrentFrame-32;
        default: return 0;
      }
    }
  },

  getLeftMargin: function(id) {
    if(!(Libs_Board.Players[id].Animation.Playing)) {
      return 0;
    }
    if(Libs_Board.Players[id].Animation.CurrentFrame < 16) {
      switch(Libs_Board.Players[id].Direction) {
        case 'East': return Libs_Board.Players[id].Animation.CurrentFrame;
        case 'West': return Libs_Board.Players[id].Animation.CurrentFrame*(-1);
        case 'NorthWest': return Libs_Board.Players[id].Animation.CurrentFrame*(-1);
        case 'NorthEast': return Libs_Board.Players[id].Animation.CurrentFrame;
        case 'SouthEast': return Libs_Board.Players[id].Animation.CurrentFrame;
        case 'SouthWest': return Libs_Board.Players[id].Animation.CurrentFrame*(-1);
        default: return 0;
      }
    }
    else {
      switch(Libs_Board.Players[id].Direction) {
        case 'East': return Libs_Board.Players[id].Animation.CurrentFrame-32;
        case 'West': return Libs_Board.Players[id].Animation.CurrentFrame*(-1)+32;
        case 'NorthWest': return Libs_Board.Players[id].Animation.CurrentFrame*(-1)+32;
        case 'NorthEast': return Libs_Board.Players[id].Animation.CurrentFrame-32;
        case 'SouthEast': return Libs_Board.Players[id].Animation.CurrentFrame-32;
        case 'SouthWest': return Libs_Board.Players[id].Animation.CurrentFrame*(-1)+32;
        default: return 0;
      }
    }
  }

};