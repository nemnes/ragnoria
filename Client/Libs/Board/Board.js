var Libs_Board = {

  AnimationFrame: 0,
  CursorPosition: {X: 0, Y: 0},

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

  ItemsAmount: 0,
  ItemsLoaded: 0,


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

    Libs_Effect.init();
    Libs_Board.loadItems();
    Libs_Renderer.LightImage = new Image();
    Libs_Renderer.LightImage.src = 'assets/light/light.png';
    Libs_Renderer.LightImage.onload = function() {
      Libs_Loader.reachedMilestone('Light');
    }

    $('#board', document).on('mousemove mousedown mouseup', function(event){
      let bounds = event.target.getBoundingClientRect();
      let x = parseInt((parseInt(event.clientX) - parseInt(bounds.left) - parseInt(Libs_Renderer.LeftMargin*Libs_Board.Scale)) / (32*Libs_Board.Scale));
      let y = parseInt((parseInt(event.clientY) - parseInt(bounds.top) - parseInt(Libs_Renderer.TopMargin*Libs_Board.Scale)) / (32*Libs_Board.Scale));
      Libs_Board.CursorPosition = {X: x, Y: y};

      if(event.type === 'mousedown' && event.which === 1) {
        let dragX = Libs_Board.CursorPosition.X + Libs_Board.AreaStart.X;
        let dragY = Libs_Board.CursorPosition.Y + Libs_Board.AreaStart.Y;
        let stack = Libs_Board.Area[dragY][dragX];
        Libs_Mouse.Dragging = {X: dragX, Y: dragY, Item: stack[stack.length-1]};
      }
      if(event.type === 'mouseup') {
        if(Libs_Mouse.Dragging && ((Libs_Board.CursorPosition.X+Libs_Board.AreaStart.X) !== Libs_Mouse.Dragging.X) || ((Libs_Board.CursorPosition.Y+Libs_Board.AreaStart.Y) !== Libs_Mouse.Dragging.Y)) {
          if(Libs_Item[Libs_Mouse.Dragging.Item[0]].IsMoveable) {
            App.emit('Push', [Libs_Mouse.Dragging.X, Libs_Mouse.Dragging.Y, (Libs_Board.CursorPosition.X+Libs_Board.AreaStart.X), (Libs_Board.CursorPosition.Y+Libs_Board.AreaStart.Y), Libs_Mouse.Dragging.Item]);
          }
        }
        document.body.style.cursor = 'default';
        Libs_Mouse.Dragging = false;
      }
      if(event.type === 'mousemove' && Libs_Mouse.Dragging) {
        document.body.style.cursor = 'url("assets/ui/cursor-crosshair.png") 10 10, default';
      }

    });
    Libs_Loader.reachedMilestone('Board');
  },

  setArea: function(area) {
    Libs_Board.Area = area;
    Libs_Board.AreaStart.Y = parseInt(Object.keys(area)[0]);
    Libs_Board.AreaStart.X = parseInt(Object.keys(area[Libs_Board.AreaStart.Y])[0]);
  },

  loadItems: function() {
    Libs_Board.ItemsAmount = Object.keys(Libs_Item).length;
    for(let item in Libs_Item) {
      Libs_Item[item].Image = new Image;
      Libs_Item[item].Image.src = Libs_Misc.getItemURL(Libs_Item[item].Id);
      Libs_Item[item].Image.onload = function(){
        Libs_Board.ItemsLoaded++;
        if(Libs_Board.ItemsLoaded === Libs_Board.ItemsAmount) {
          Libs_Loader.reachedMilestone('Items');
        }
      };
    }
  },

  updateSQM: function(x, y, stack) {
    if(typeof Libs_Board.Area[y] == 'undefined') return;
    if(typeof Libs_Board.Area[y][x] == 'undefined') return;
    if(Libs_Hero.Animation.Playing || Libs_Hero.Animation.CurrentFrame > 0) {
      Libs_Movement.AreaChangesWhileWalking.push({X: x, Y: y, Stack: stack});
    }
    Libs_Board.Area[y][x] = stack;
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
  },


};