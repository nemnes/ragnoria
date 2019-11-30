var Libs_Board = {

  Width: 33,
  Height: 19,
  AreaStart: {X: null, Y: null},
  Area: {},
  Players: {},
  NPCs: {},

  board: null,
  boardCTX: null,
  fog: null,
  fogCTX: null,
  canvasScale: 2,
  canvasAntialiasing: false,
  LightEffectsEnabled: true,
  lightSources: [],

  FramerateLimit: 100,
  RenderingInProgress: false,
  RenderingStopped: false,
  FramesDropped: 0,
  FramesRendered: 0,

  init: function(area) {
    $('<canvas id="board" width="' +((Libs_Board.Width*32)*Libs_Board.canvasScale)+ 'px" height="' +((Libs_Board.Height*32)*Libs_Board.canvasScale)+ 'px"></canvas>').appendTo($('body'));
    Libs_Board.board = document.getElementById("board");
    Libs_Board.boardCTX = Libs_Board.board.getContext("2d");
    Libs_Board.boardCTX.scale(Libs_Board.canvasScale, Libs_Board.canvasScale);
    Libs_Board.boardCTX.imageSmoothingEnabled = Libs_Board.canvasAntialiasing;

    Libs_Board.fog = document.createElement('canvas');
    Libs_Board.fog.width = (Libs_Board.Width*32)*Libs_Board.canvasScale;
    Libs_Board.fog.height = (Libs_Board.Height*32)*Libs_Board.canvasScale;
    Libs_Board.fogCTX = Libs_Board.fog.getContext('2d');

    Libs_Board.Area = area;
    Libs_Board.AreaStart.Y = parseInt(Object.keys(area)[0]);
    Libs_Board.AreaStart.X = parseInt(Object.keys(area[Libs_Board.AreaStart.Y])[0]);

    for(let item in Libs_Item) {
      Libs_Item[item].Image = new Image;
      Libs_Item[item].Image.src = Libs_Misc.getItemURL(Libs_Item[item].Id);
    }

    setInterval(function() {
      if(!Libs_Board.RenderingInProgress && !Libs_Board.RenderingStopped) {
        Libs_Board.render();
      }
      else {
        Libs_Board.FramesDropped++;
      }
    }, 1000/Libs_Board.FramerateLimit);

    setInterval(function() {
//      console.log(Libs_Board.FramesRendered);
      Libs_Board.FramesRendered = 0;
    }, 1000);

  },

  render: function(){
    Libs_Board.RenderingInProgress = true;
    Libs_Board.lightSources = [];
//    Libs_Board.boardCTX.clearRect(0, 0, Libs_Board.board.width, Libs_Board.board.height);

    var TopMargin = Libs_Hero.getTopMargin();
    var LeftMargin = Libs_Hero.getLeftMargin();
    var X_SERVER;
    var Y_SERVER;
    var X_CLIENT;
    var Y_CLIENT;

    // iterate over area SQMs
    var areaIterations = 2;
    for(var areaIteration=1;areaIteration<=areaIterations;areaIteration++) {
      Y_CLIENT = 0;
      for(Y_SERVER in Libs_Board.Area) if (Libs_Board.Area.hasOwnProperty(Y_SERVER)) {
        X_CLIENT = 0;
        for (X_SERVER in Libs_Board.Area[Y_SERVER]) if (Libs_Board.Area[Y_SERVER].hasOwnProperty(X_SERVER)) {

          if(areaIteration === 1) {
            Libs_Board.renderFloor(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
          }
          if(areaIteration === 2) {
            Libs_Board.renderItems(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Board.renderHero(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Board.renderPlayers(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Board.renderNPCs(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Board.renderItemsAlwaysTop(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
          }

          X_CLIENT++;
        }
        Y_CLIENT++;
      }
    }

    Libs_Board.renderNicknames(TopMargin, LeftMargin);
    if(Libs_Board.LightEffectsEnabled) {
      Libs_Board.renderFog();
    }

    Libs_Board.RenderingInProgress = false;
    Libs_Board.FramesRendered++;
  },

  renderFloor: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    var SQM = Libs_Board.Area[Y_SERVER][X_SERVER];
    for(var stack in SQM) if (SQM.hasOwnProperty(stack)) {
      var Item = Libs_Item[SQM[stack]];
      if([1,2].includes(Item.ItemTypeId)) {
        Libs_Board.drawImage({
          Top: (Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (TopMargin),
          Left: (X_CLIENT * 32) - ((Item.Size * 32) - 32) + (LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Item.Image,
        });
      }
    }
  },

  renderHero: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    var X_HERO_VIRTUAL = Libs_Hero.X;
    var Y_HERO_VIRTUAL = Libs_Hero.Y;
    var X_CLIENT_VIRTUAL = X_CLIENT;
    var Y_CLIENT_VIRTUAL = Y_CLIENT;
    if(Libs_Hero.Animation.CurrentFrame > 16) {
      switch(Libs_Hero.Direction) {
        case 'North':
          Y_HERO_VIRTUAL--;
          Y_CLIENT_VIRTUAL++;
          break;
        case 'NorthEast':
          Y_HERO_VIRTUAL--;
          Y_CLIENT_VIRTUAL++;
          X_HERO_VIRTUAL++;
          X_CLIENT_VIRTUAL--;
          break;
        case 'NorthWest':
          Y_HERO_VIRTUAL--;
          Y_CLIENT_VIRTUAL++;
          X_HERO_VIRTUAL--;
          X_CLIENT_VIRTUAL++;
          break;
        case 'West':
          X_HERO_VIRTUAL--;
          X_CLIENT_VIRTUAL++;
          break;
        case 'East':
          X_HERO_VIRTUAL++;
          X_CLIENT_VIRTUAL--;
          break;
        case 'South':
          Y_HERO_VIRTUAL++;
          Y_CLIENT_VIRTUAL--;
          break;
        case 'SouthEast':
          X_HERO_VIRTUAL++;
          Y_HERO_VIRTUAL++;
          X_CLIENT_VIRTUAL--;
          Y_CLIENT_VIRTUAL--;
          break;
        case 'SouthWest':
          X_HERO_VIRTUAL--;
          Y_HERO_VIRTUAL++;
          X_CLIENT_VIRTUAL++;
          Y_CLIENT_VIRTUAL--;
          break;
      }
    }

    if(parseInt(Y_HERO_VIRTUAL) === parseInt(Y_SERVER) && parseInt(X_HERO_VIRTUAL) === parseInt(X_SERVER)) {
      Libs_Board.drawImage({
        Top: ((Y_CLIENT_VIRTUAL * 32) - 40),
        Left: ((X_CLIENT_VIRTUAL * 32) - 40),
        Width: 64,
        Height: 64,
        LeftOffset: Libs_Hero.getLeftOffset(),
        TopOffset: Libs_Hero.getTopOffset(),
        Image: Libs_Hero.Image
      });
    }
  },

  renderPlayers: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    for(var playerId in Libs_Board.Players) if (Libs_Board.Players.hasOwnProperty(playerId)) {
      var Player = Libs_Board.Players[playerId];

      // pretend player is on previous frame for first 16 frames of his walking animation to keep good layer order on board
      var X_PLAYER_VIRTUAL = Player.X;
      var Y_PLAYER_VIRTUAL = Player.Y;
      if(Player.Animation.Playing && Player.Animation.CurrentFrame < 16) {
        switch(Player.Direction) {
          case 'North':
            Y_PLAYER_VIRTUAL++;
            break;
          case 'South':
            Y_PLAYER_VIRTUAL--;
            break;
          case 'West':
            X_PLAYER_VIRTUAL++;
            break;
          case 'East':
            X_PLAYER_VIRTUAL--;
            break;
          case 'NorthEast':
            Y_PLAYER_VIRTUAL++;
            X_PLAYER_VIRTUAL--;
            break;
          case 'NorthWest':
            Y_PLAYER_VIRTUAL++;
            X_PLAYER_VIRTUAL++;
            break;
          case 'SouthEast':
            Y_PLAYER_VIRTUAL--;
            X_PLAYER_VIRTUAL--;
            break;
          case 'SouthWest':
            Y_PLAYER_VIRTUAL--;
            X_PLAYER_VIRTUAL++;
            break;
        }
      }

      if(parseInt(Y_PLAYER_VIRTUAL) === parseInt(Y_SERVER) && parseInt(X_PLAYER_VIRTUAL) === parseInt(X_SERVER)) {
        Libs_Board.drawImage({
          Top: ((Y_CLIENT * 32) - 40) + (TopMargin) + Libs_Player.getTopMargin(playerId),
          Left: ((X_CLIENT* 32) - 40) + (LeftMargin) + Libs_Player.getLeftMargin(playerId),
          Width: 64,
          Height: 64,
          LeftOffset: Libs_Player.getLeftOffset(playerId),
          TopOffset: Libs_Player.getTopOffset(playerId),
          Image: Player.Image
        });
      }
    }
  },

  renderNPCs: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    for(var npcId in Libs_Board.NPCs) if (Libs_Board.NPCs.hasOwnProperty(npcId)) {
      var NPC = Libs_Board.NPCs[npcId];
      if(parseInt(NPC.Y) === parseInt(Y_SERVER) && parseInt(NPC.X) === parseInt(X_SERVER)) {
        Libs_Board.drawImage({
          Top: ((Y_CLIENT * 32) - 40) + (TopMargin),
          Left: ((X_CLIENT* 32) - 40) + (LeftMargin),
          Width: 64,
          Height: 64,
          LeftOffset: 0, //Libs_Player.getLeftOffset(playerId),
          TopOffset: 0, //Libs_Player.getTopOffset(playerId),
          Image: NPC.Image
        });
      }
    }
  },

  renderItems: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    var SQM = Libs_Board.Area[Y_SERVER][X_SERVER];
    for(var stack in SQM) if (SQM.hasOwnProperty(stack)) {
      var Item = Libs_Item[SQM[stack]];
      if(Item.IsAlwaysTop) {
        continue;
      }
      if(!([1,2].includes(Item.ItemTypeId))) {
        if(Item.LightLevel > 0) {
          Libs_Board.lightSources.push({
            Top: (Y_CLIENT * 32) + (Item.Size * 16) + (TopMargin),
            Left: (X_CLIENT * 32) + (Item.Size * 16) + (LeftMargin),
            LightLevel: Item.LightLevel,
            LightColor: Item.LightColor
          });
        }
        Libs_Board.drawImage({
          Top: (Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (TopMargin),
          Left: (X_CLIENT * 32) - ((Item.Size * 32) - 32) + (LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Item.Image,
        });
      }
    }
  },

  renderItemsAlwaysTop: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    var SQM = Libs_Board.Area[Y_SERVER][X_SERVER];
    for(var stack in SQM) if (SQM.hasOwnProperty(stack)) {
      var Item = Libs_Item[SQM[stack]];
      if(!(Item.IsAlwaysTop)) {
        continue;
      }
      if(!([1,2].includes(Item.ItemTypeId))) {
        if(Item.LightLevel > 0) {
          Libs_Board.lightSources.push({
            Top: (Y_CLIENT * 32) + (Item.Size * 16) + (TopMargin),
            Left: (X_CLIENT * 32) + (Item.Size * 16) + (LeftMargin),
            LightLevel: Item.LightLevel,
            LightColor: Item.LightColor
          });
        }
        Libs_Board.drawImage({
          Top: (Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (TopMargin),
          Left: (X_CLIENT * 32) - ((Item.Size * 32) - 32) + (LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Item.Image,
        });
      }
    }
  },

  renderNicknames: function(TopMargin, LeftMargin) {
    // players
    for(let playerId in Libs_Board.Players) if (Libs_Board.Players.hasOwnProperty(playerId)) {
      Libs_Board.renderNickname(TopMargin, LeftMargin, Libs_Board.Players[playerId], 'Player');
    }
    // NPCs
    for(let npcId in Libs_Board.NPCs) if (Libs_Board.NPCs.hasOwnProperty(npcId)) {
      Libs_Board.renderNickname(TopMargin, LeftMargin, Libs_Board.NPCs[npcId], 'NPC');
    }
    // hero
    Libs_Board.renderNickname(TopMargin, LeftMargin, Libs_Hero, 'Hero');
  },

  renderNickname: function(TopMargin, LeftMargin, Creature, CreatureType) {
    var Top, Left, Color, VirtualCoords;
    if(CreatureType === 'Player') {
      // If player is walking we have to pretend that he is still on previous SQM (for first 16 frames of animation) to keep good layer order
      VirtualCoords = Libs_Board.getCreatureVirtualCoordinates(Creature);
      Top = (VirtualCoords.Y * 32) - 14 + (TopMargin) + Libs_Player.getTopMargin(Creature.Id);
      Left = (VirtualCoords.X * 32) + 4 + (LeftMargin) + Libs_Player.getLeftMargin(Creature.Id);
      Color = '#43a94f';
    }
    if(CreatureType === 'NPC') {
      Top = (Creature.Y - Libs_Board.AreaStart.Y) * 32 - 14 + TopMargin;
      Left = (Creature.X - Libs_Board.AreaStart.X) * 32 + 4 + LeftMargin;
      Color = '#fefff8';
    }
    if(CreatureType === 'Hero') {
      Top = (Creature.Y - Libs_Board.AreaStart.Y) * 32 - 14;
      Left = (Creature.X - Libs_Board.AreaStart.X) * 32 + 4;
      Color = '#43a94f';
    }

    Libs_Board.drawText({
      Text: Creature.Name,
      Font: "bold 6px Tahoma",
      Top: Top,
      Left: Left,
      Color: Color,
      Stroke: true,
      StrokeColor: '#000000',
      StrokeWidth: 2
    });
  },

  renderFog: function() {
    Libs_Board.fogCTX.clearRect(0, 0, Libs_Board.fog.width, Libs_Board.fog.height);

    for(let i in Libs_Board.lightSources) if(Libs_Board.lightSources.hasOwnProperty(i)) {
      let lightSource = Libs_Board.lightSources[i];
      Libs_Board.addLightSource(lightSource.Left,lightSource.Top,lightSource.LightLevel,lightSource.LightColor);
    }

    Libs_Board.boardCTX.globalAlpha = 0.5;
    Libs_Board.boardCTX.globalCompositeOperation = 'overlay';
    Libs_Board.boardCTX.drawImage(Libs_Board.fog, 0, 0);


    Libs_Board.fogCTX.beginPath();
    Libs_Board.fogCTX.rect(0, 0, Libs_Board.fog.width, Libs_Board.fog.height);
    Libs_Board.fogCTX.fillStyle = "#000000";
    Libs_Board.fogCTX.fill();
    for(let i in Libs_Board.lightSources) if(Libs_Board.lightSources.hasOwnProperty(i)) {
      let lightSource = Libs_Board.lightSources[i];
      Libs_Board.addLightSource(lightSource.Left,lightSource.Top,lightSource.LightLevel,lightSource.LightColor);
    }

    Libs_Board.boardCTX.globalAlpha = 0.2;
    Libs_Board.boardCTX.globalCompositeOperation = 'multiply';
    Libs_Board.boardCTX.drawImage(Libs_Board.fog, 0, 0);

    Libs_Board.boardCTX.globalAlpha = 1;
    Libs_Board.boardCTX.globalCompositeOperation = 'source-over';

  },

  addLightSource: function(left,top,level,color) {
    var innerRadius = 1;
    var totalRadius = 16 * level * 2;
    var radgrad = Libs_Board.fogCTX.createRadialGradient(left,top,innerRadius,left,top,totalRadius);
    radgrad.addColorStop(0, Libs_Misc.hexToRgba(color, 0.9));
    radgrad.addColorStop(0.7, Libs_Misc.hexToRgba(color, 0.1));
    radgrad.addColorStop(1, Libs_Misc.hexToRgba(color, 0));

    Libs_Board.fogCTX.fillStyle = radgrad;
    Libs_Board.fogCTX.fillRect(0,0,left+totalRadius,top+totalRadius);
  },


  drawImage: function(params) {
    Libs_Board.boardCTX.drawImage(params.Image, params.LeftOffset, params.TopOffset, params.Width, params.Height, params.Left, params.Top, params.Width, params.Height);
  },

  drawText: function(params) {
    Libs_Board.boardCTX.font = params.Font;
    Libs_Board.boardCTX.textAlign = "center";
    if(params.Stroke) {
      Libs_Board.boardCTX.lineJoin="round";
      Libs_Board.boardCTX.miterLimit=2;
      Libs_Board.boardCTX.strokeStyle = params.StrokeColor;
      Libs_Board.boardCTX.lineWidth = params.StrokeWidth;
      Libs_Board.boardCTX.strokeText(params.Text, params.Left, params.Top);
    }
    Libs_Board.boardCTX.fillStyle = params.Color;
    Libs_Board.boardCTX.fillText(params.Text, params.Left, params.Top);
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