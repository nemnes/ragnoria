var Libs_Renderer = {

  FramerateLimit: 100,
  RenderingInProgress: false,
  RenderingStopped: false,
  FramesDropped: 0,
  FramesRendered: 0,

  init: function() {
    setInterval(function() {
      if(!Libs_Renderer.RenderingInProgress && !Libs_Renderer.RenderingStopped) {
        Libs_Renderer.render();
      }
      else {
        Libs_Renderer.FramesDropped++;
      }
    }, 1000/Libs_Renderer.FramerateLimit);

    setInterval(function() {
//      console.log(Libs_Renderer.FramesRendered);
      Libs_Board.AnimationFrame = Libs_Board.AnimationFrame > 0 ? 0 : 1;
      Libs_Renderer.FramesRendered = 0;
    }, 1000);
  },

  render: function(){
    Libs_Renderer.RenderingInProgress = true;
    if(Libs_Board.LightEffects) {
      Libs_Board.lightCTX.clearRect(0, 0, Libs_Board.light.width, Libs_Board.light.height);
    }

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
            Libs_Renderer.renderFloor(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
          }
          if(areaIteration === 2) {
            Libs_Renderer.renderItems(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Renderer.renderHero(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Renderer.renderPlayers(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Renderer.renderNPCs(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Renderer.renderItemsAlwaysTop(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
          }

          X_CLIENT++;
        }
        Y_CLIENT++;
      }
    }

    Libs_Renderer.renderNicknames(TopMargin, LeftMargin);
    if(Libs_Board.LightEffects) {
      Libs_Renderer.renderFog();
    }

    Libs_Renderer.RenderingInProgress = false;
    Libs_Renderer.FramesRendered++;
  },

  renderFloor: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    var SQM = Libs_Board.Area[Y_SERVER][X_SERVER];
    for(var stack in SQM) if (SQM.hasOwnProperty(stack)) {
      var Item = Libs_Item[SQM[stack]];
      if([1,2].includes(Item.ItemTypeId)) {
        Libs_Renderer.drawImage({
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

      if(Libs_Board.LightEffects) {
        Libs_Renderer.addLightSource({
          Top: (Y_CLIENT_VIRTUAL * 32) + 13,
          Left: (X_CLIENT_VIRTUAL * 32) + 10,
          LightLevel: 5,
          LightColor: 'orange',
          LightSize: 3
        });
      }
      Libs_Renderer.drawImage({
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
        Libs_Renderer.drawImage({
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
        Libs_Renderer.drawImage({
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
    var Altitude = 0;
    for(var stack in SQM) if (SQM.hasOwnProperty(stack)) {
      var Item = Libs_Item[SQM[stack]];
      if(Item.IsAlwaysTop) {
        continue;
      }
      if(!([1,2].includes(Item.ItemTypeId))) {
        if(Item.LightLevel > 0 && Item.LightSize > 0 && Libs_Board.LightEffects) {
          Libs_Renderer.addLightSource({
            Top: (Y_CLIENT * 32) + (Item.Size * 16) + (TopMargin),
            Left: (X_CLIENT * 32) + (Item.Size * 16) + (LeftMargin),
            LightLevel: Item.LightLevel,
            LightColor: Item.LightColor,
            LightSize: Item.LightSize
          });
        }
        Libs_Renderer.drawImage({
          Top: (Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (TopMargin) - Altitude,
          Left: (X_CLIENT * 32) - ((Item.Size * 32) - 32) + (LeftMargin) - Altitude,
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: Item.IsAnimating ? (Libs_Board.AnimationFrame * 32) * Item.Size : 0,
          TopOffset: 0,
          Image: Item.Image,
        });
        Altitude += Item.Altitude;
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
        if(Item.LightLevel > 0 && Item.LightSize > 0 && Libs_Board.LightEffects) {
          Libs_Renderer.addLightSource({
            Top: (Y_CLIENT * 32) + (Item.Size * 16) + (TopMargin),
            Left: (X_CLIENT * 32) + (Item.Size * 16) + (LeftMargin),
            LightLevel: Item.LightLevel,
            LightColor: Item.LightColor,
            LightSize: Item.LightSize
          });
        }
        Libs_Renderer.drawImage({
          Top: (Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (TopMargin),
          Left: (X_CLIENT * 32) - ((Item.Size * 32) - 32) + (LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: Item.IsAnimating ? (Libs_Board.AnimationFrame * 32) * Item.Size : 0,
          TopOffset: 0,
          Image: Item.Image,
        });
      }
    }
  },

  renderNicknames: function(TopMargin, LeftMargin) {
    // players
    for(let playerId in Libs_Board.Players) if (Libs_Board.Players.hasOwnProperty(playerId)) {
      Libs_Renderer.renderNickname(TopMargin, LeftMargin, Libs_Board.Players[playerId], 'Player');
    }
    // NPCs
    for(let npcId in Libs_Board.NPCs) if (Libs_Board.NPCs.hasOwnProperty(npcId)) {
      Libs_Renderer.renderNickname(TopMargin, LeftMargin, Libs_Board.NPCs[npcId], 'NPC');
    }
    // hero
    Libs_Renderer.renderNickname(TopMargin, LeftMargin, Libs_Hero, 'Hero');
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

    Libs_Renderer.drawText({
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
    // draw lights on board
    Libs_Board.boardCTX.globalAlpha = Libs_Board.LightPower;
    Libs_Board.boardCTX.globalCompositeOperation = 'overlay';
    Libs_Board.boardCTX.drawImage(Libs_Board.light, 0, 0);

    // fill fog canvas by black color
    Libs_Board.fogCTX.beginPath();
    Libs_Board.fogCTX.rect(0, 0, Libs_Board.fog.width, Libs_Board.fog.height);
    Libs_Board.fogCTX.fillStyle = "#000000";
    Libs_Board.fogCTX.fill();

    // draw lights on fog canvas
    Libs_Board.fogCTX.drawImage(Libs_Board.light, 0, 0);

    // draw fog on board
    Libs_Board.boardCTX.globalAlpha = Libs_Board.FogDensity;
    Libs_Board.boardCTX.globalCompositeOperation = 'multiply';
    Libs_Board.boardCTX.drawImage(Libs_Board.fog, 0, 0);

    // reset globals
    Libs_Board.boardCTX.globalAlpha = 1;
    Libs_Board.boardCTX.globalCompositeOperation = 'source-over';
  },

  addLightSource: function(params) {
    if(Libs_Board.LightImage) {
      let leftOffset;
      switch(params.LightColor) {
        case 'red': leftOffset = 0; break;
        case 'orange': leftOffset = 32; break;
        case 'yellow': leftOffset = 64; break;
        case 'green': leftOffset = 96; break;
        case 'ltblue': leftOffset = 128; break;
        case 'blue': leftOffset = 160; break;
        case 'purple': leftOffset = 192; break;
        default: leftOffset = 0; break;
      }
      let topOffset = (params.LightLevel * 32) - 32;
      params.LightSize = params.LightSize*2;
      params.Left = params.Left - ((32*params.LightSize)/2);
      params.Top = params.Top - ((32*params.LightSize)/2);
      Libs_Board.lightCTX.drawImage(Libs_Board.LightImage, leftOffset,topOffset,32,32, params.Left, params.Top, 32*params.LightSize, 32*params.LightSize);
    }
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

};