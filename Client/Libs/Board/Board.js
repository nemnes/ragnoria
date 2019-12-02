var Libs_Board = {

  AnimationFrame: 0,

  Width: 31,
  Height: 17,
  Scale: 2.2,

  AreaStart: {X: null, Y: null},
  Area: {},
  Players: {},
  NPCs: {},
  Effects: {},

  board: null,
  boardCTX: null,
  hud: null,
  hudCTX: null,
  fog: null,
  fogCTX: null,
  light: null,
  lightCTX: null,


  init: function(area) {
    $('<canvas id="board" width="' +(Libs_Board.Width*32)+ 'px" height="' +(Libs_Board.Height*32)+ 'px" style="transform: translate(-50%, -50%) scale(' +Libs_Board.Scale+ ');"></canvas>').appendTo($('body'));
    Libs_Board.board = document.getElementById("board");
    Libs_Board.boardCTX = Libs_Board.board.getContext("2d");

    $('<canvas id="hud" width="' +((Libs_Board.Width*32)*Libs_Board.Scale)+ 'px" height="' +((Libs_Board.Height*32)*Libs_Board.Scale)+ 'px"></canvas>').appendTo($('body'));
    Libs_Board.hud = document.getElementById("hud");
    Libs_Board.hudCTX = Libs_Board.hud.getContext("2d");

    Libs_Board.light = document.createElement('canvas');
    Libs_Board.light.width = (Libs_Board.Width*32);
    Libs_Board.light.height = (Libs_Board.Height*32);
    Libs_Board.lightCTX = Libs_Board.light.getContext('2d');

    Libs_Board.fog = document.createElement('canvas');
    Libs_Board.fog.width = (Libs_Board.Width*32);
    Libs_Board.fog.height = (Libs_Board.Height*32);
    Libs_Board.fogCTX = Libs_Board.fog.getContext('2d');

    Libs_Board.Area = area;
    Libs_Board.AreaStart.Y = parseInt(Object.keys(area)[0]);
    Libs_Board.AreaStart.X = parseInt(Object.keys(area[Libs_Board.AreaStart.Y])[0]);

    Libs_Effect.init();
    for(let item in Libs_Item) {
      Libs_Item[item].Image = new Image;
      Libs_Item[item].Image.src = Libs_Misc.getItemURL(Libs_Item[item].Id);
    }

    Libs_Renderer.init();
  },

  setNight: function() {
    Libs_Renderer.FogDensity = 1;
  },

  setDay: function() {
    Libs_Renderer.FogDensity = 0.2;
  },

  getCreatureVirtualCoordinates: function(Creature) {
    let VirtualCoords = {
      X: Creature.X - Libs_Board.AreaStart.X,
      Y: Creature.Y - Libs_Board.AreaStart.Y
    };
    if(Creature.Animation.Playing && Creature.Animation.CurrentFrame < 16) {
      switch (Creature.Direction) {
        case 'North':
          VirtualCoords.Y++;
          break;
        case 'South':
          VirtualCoords.Y--;
          break;
        case 'West':
          VirtualCoords.X++;
          break;
        case 'East':
          VirtualCoords.X--;
          break;
        case 'NorthEast':
          VirtualCoords.Y++;
          VirtualCoords.X--;
          break;
        case 'NorthWest':
          VirtualCoords.Y++;
          VirtualCoords.X++;
          break;
        case 'SouthEast':
          VirtualCoords.Y--;
          VirtualCoords.X--;
          break;
        case 'SouthWest':
          VirtualCoords.Y--;
          VirtualCoords.X++;
          break;
      }
    }
    return VirtualCoords;
  }


};