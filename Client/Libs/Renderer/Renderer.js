var Libs_Renderer = {

  FramerateLimit: 80,
  RenderingInProgress: false,
  RenderingStopped: false,
  FramesDropped: 0,
  FramesRendered: 0,
  CurrentFramerate: 0,

  // light
  LightEffects: true,
  LightPower: 0.35, // 0.35 seems be ok
  FogDensity: 0.25, // 0.2 seems be ok
  LightImage: null,

  // rendering auxiliary fields
  TopMargin: 0,
  LeftMargin: 0,
  X_SERVER: 0,
  Y_SERVER: 0,
  X_CLIENT: 0,
  Y_CLIENT: 0,

  init: function() {

    Libs_Renderer.LightImage = new Image();
    Libs_Renderer.LightImage.src = 'http://root.localhost/ragnoria/Client/assets/light/light.png';

    Libs_Renderer.run();
    setInterval(function() {
      Libs_Board.AnimationFrame = Libs_Board.AnimationFrame > 0 ? 0 : 1;
      Libs_Renderer.CurrentFramerate = Libs_Renderer.FramesRendered;
      Libs_Renderer.FramesRendered = 0;
    }, 1000);
  },

  run: function() {
    App.clearInterval('Renderer');
    App.addInterval('Renderer', function(){
      if(!Libs_Renderer.RenderingInProgress && !Libs_Renderer.RenderingStopped) {
        Libs_Renderer.render();
      }
      else {
        Libs_Renderer.FramesDropped++;
      }
    }, 1000/Libs_Renderer.FramerateLimit);
  },

  render: function(){
    Libs_Renderer.RenderingInProgress = true;
    if(Libs_Renderer.LightEffects) {
      Libs_Board.lightCTX.clearRect(0, 0, Libs_Board.light.width, Libs_Board.light.height);
    }

    Libs_Renderer.TopMargin = Libs_Hero.getTopMargin();
    Libs_Renderer.LeftMargin = Libs_Hero.getLeftMargin();

    Libs_Board.hudCTX.clearRect(0,0,(Libs_Board.Width*32)*Libs_Board.Scale,(Libs_Board.Height*32)*Libs_Board.Scale);

    // iterate over area SQMs
    let areaIterations = 2;
    for(let areaIteration=1;areaIteration<=areaIterations;areaIteration++) {
      Libs_Renderer.Y_CLIENT = 0;
      for(Libs_Renderer.Y_SERVER in Libs_Board.Area) if (Libs_Board.Area.hasOwnProperty(Libs_Renderer.Y_SERVER)) {
        Libs_Renderer.X_CLIENT = 0;
        for (Libs_Renderer.X_SERVER in Libs_Board.Area[Libs_Renderer.Y_SERVER]) if (Libs_Board.Area[Libs_Renderer.Y_SERVER].hasOwnProperty(Libs_Renderer.X_SERVER)) {

          let SQM = Libs_Board.Area[Libs_Renderer.Y_SERVER][Libs_Renderer.X_SERVER];

          if(areaIteration === 1) {
            Libs_Renderer.renderFloor(SQM);
          }
          if(areaIteration === 2) {
            Libs_Renderer.renderItems(SQM);
            Libs_Renderer.renderHero();
            Libs_Renderer.renderPlayers();
            Libs_Renderer.renderNPCs();
            Libs_Renderer.renderEffects(SQM);
            Libs_Renderer.renderItemsAlwaysTop(SQM);
          }

          Libs_Renderer.X_CLIENT++;
        }
        Libs_Renderer.Y_CLIENT++;
      }
    }

    Libs_Renderer.renderNicknames();
    if(Libs_Renderer.LightEffects) {
      Libs_Renderer.renderFog();
    }

    Libs_Renderer.RenderingInProgress = false;
    Libs_Renderer.FramesRendered++;
  },

  renderFloor: function(SQM) {
    for(let stack in SQM) if (SQM.hasOwnProperty(stack)) {
      let Item = Libs_Item[SQM[stack][0]];
      if([1,2].includes(Item.ItemTypeId)) {
        Libs_Renderer.drawImage({
          Top: (Libs_Renderer.Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (Libs_Renderer.TopMargin),
          Left: (Libs_Renderer.X_CLIENT * 32) - ((Item.Size * 32) - 32) + (Libs_Renderer.LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Item.Image,
        });
      }
    }
  },

  renderHero: function() {
    let X_HERO_VIRTUAL = Libs_Hero.X;
    let Y_HERO_VIRTUAL = Libs_Hero.Y;
    let X_CLIENT_VIRTUAL = Libs_Renderer.X_CLIENT;
    let Y_CLIENT_VIRTUAL = Libs_Renderer.Y_CLIENT;
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

    if(parseInt(Y_HERO_VIRTUAL) === parseInt(Libs_Renderer.Y_SERVER) && parseInt(X_HERO_VIRTUAL) === parseInt(Libs_Renderer.X_SERVER)) {

      if(Libs_Renderer.LightEffects) {
        Libs_Renderer.addLightSource({
          Top: (Y_CLIENT_VIRTUAL * 32) + 13,
          Left: (X_CLIENT_VIRTUAL * 32) + 10,
          LightLevel: 5,
          LightColor: 'orange',
          LightSize: 3,
          Margins: 0
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

  renderPlayers: function() {
    for(let playerId in Libs_Board.Players) if (Libs_Board.Players.hasOwnProperty(playerId)) {
      let Player = Libs_Board.Players[playerId];

      // pretend player is on previous frame for first 16 frames of his walking animation to keep good layer order on board
      let X_PLAYER_VIRTUAL = Player.X;
      let Y_PLAYER_VIRTUAL = Player.Y;
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

      if(parseInt(Y_PLAYER_VIRTUAL) === parseInt(Libs_Renderer.Y_SERVER) && parseInt(X_PLAYER_VIRTUAL) === parseInt(Libs_Renderer.X_SERVER)) {
        Libs_Renderer.drawImage({
          Top: ((Libs_Renderer.Y_CLIENT * 32) - 40) + (Libs_Renderer.TopMargin) + Libs_Player.getTopMargin(playerId),
          Left: ((Libs_Renderer.X_CLIENT* 32) - 40) + (Libs_Renderer.LeftMargin) + Libs_Player.getLeftMargin(playerId),
          Width: 64,
          Height: 64,
          LeftOffset: Libs_Player.getLeftOffset(playerId),
          TopOffset: Libs_Player.getTopOffset(playerId),
          Image: Player.Image
        });
      }
    }
  },

  renderNPCs: function() {
    for(let npcId in Libs_Board.NPCs) if (Libs_Board.NPCs.hasOwnProperty(npcId)) {
      let NPC = Libs_Board.NPCs[npcId];
      if(parseInt(NPC.Y) === parseInt(Libs_Renderer.Y_SERVER) && parseInt(NPC.X) === parseInt(Libs_Renderer.X_SERVER)) {
        Libs_Renderer.drawImage({
          Top: ((Libs_Renderer.Y_CLIENT * 32) - 40) + (Libs_Renderer.TopMargin),
          Left: ((Libs_Renderer.X_CLIENT* 32) - 40) + (Libs_Renderer.LeftMargin),
          Width: 64,
          Height: 64,
          LeftOffset: 0, //Libs_Player.getLeftOffset(playerId),
          TopOffset: 0, //Libs_Player.getTopOffset(playerId),
          Image: NPC.Image
        });
      }
    }
  },

  renderItems: function(SQM) {
    let Altitude = 0;
    for(let stack in SQM) if (SQM.hasOwnProperty(stack)) {
      let Item = Libs_Item[SQM[stack][0]];
      if(!([1,2].includes(Item.ItemTypeId))) {

        let Quantity = 1;
        if(Item.IsAlwaysTop) {
          continue;
        }
        if(Item.IsStackable) {
          Quantity = SQM[stack][1];
        }

        if(Item.LightLevel > 0 && Item.LightSize > 0 && Libs_Renderer.LightEffects) {
          Libs_Renderer.addLightSource({
            Top: (Libs_Renderer.Y_CLIENT * 32) + (Item.Size * 16) + (Libs_Renderer.TopMargin),
            Left: (Libs_Renderer.X_CLIENT * 32) + (Item.Size * 16) + (Libs_Renderer.LeftMargin),
            LightLevel: Item.LightLevel,
            LightColor: Item.LightColor,
            LightSize: Item.LightSize,
            Margins: Altitude*(-1)
          });
        }
        Libs_Renderer.drawImage({
          Top: (Libs_Renderer.Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (Libs_Renderer.TopMargin) - Altitude,
          Left: (Libs_Renderer.X_CLIENT * 32) - ((Item.Size * 32) - 32) + (Libs_Renderer.LeftMargin) - Altitude,
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: Item.IsAnimating ? (Libs_Board.AnimationFrame * 32) * Item.Size : 0,
          TopOffset: Item.IsStackable ? function(Quantity) {
            if(Quantity === 1) { return 0; }
            if(Quantity === 2) { return 32; }
            if(Quantity === 3) { return 32*2; }
            if(Quantity === 4) { return 32*3; }
            if(Quantity >= 5 && Quantity < 10) { return 32*4; }
            if(Quantity >= 10 && Quantity < 25) { return 32*5; }
            if(Quantity >= 25 && Quantity < 50) { return 32*6; }
            if(Quantity >= 50) { return 32*7; }
            return 0;
          }(Quantity) : 0,
          Image: Item.Image,
        });
        Altitude += Item.Altitude;
      }
    }
  },

  renderEffects: function(SQM) {
    for(let unique in Libs_Board.Effects) if (Libs_Board.Effects.hasOwnProperty(unique)) {
      if(Libs_Board.Effects[unique].X === parseInt(Libs_Renderer.X_SERVER) && Libs_Board.Effects[unique].Y === parseInt(Libs_Renderer.Y_SERVER)) {

        let Altitude = 0;
        for(let stack in SQM) if (SQM.hasOwnProperty(stack)) {
          Altitude += Libs_Item[SQM[stack][0]].Altitude;
        }

        let effect = Libs_Effect[Libs_Board.Effects[unique].Id];
        Libs_Renderer.drawImage({
          Top: (Libs_Renderer.Y_CLIENT * 32) + (Libs_Renderer.TopMargin) - Altitude,
          Left: (Libs_Renderer.X_CLIENT * 32) + (Libs_Renderer.LeftMargin) - Altitude,
          Width: 32,
          Height: 32,
          LeftOffset: Libs_Board.Effects[unique].Frame * 32,
          TopOffset: 0,
          Image: effect.img,
        });
      }
    }
  },

  renderItemsAlwaysTop: function(SQM) {
    for(let stack in SQM) if (SQM.hasOwnProperty(stack)) {
      let Item = Libs_Item[SQM[stack][0]];
      if(!(Item.IsAlwaysTop)) {
        continue;
      }
      if(!([1,2].includes(Item.ItemTypeId))) {
        if(Item.LightLevel > 0 && Item.LightSize > 0 && Libs_Renderer.LightEffects) {
          Libs_Renderer.addLightSource({
            Top: (Libs_Renderer.Y_CLIENT * 32) + (Item.Size * 16) + (Libs_Renderer.TopMargin),
            Left: (Libs_Renderer.X_CLIENT * 32) + (Item.Size * 16) + (Libs_Renderer.LeftMargin),
            LightLevel: Item.LightLevel,
            LightColor: Item.LightColor,
            LightSize: Item.LightSize,
            Margins: 0
          });
        }
        Libs_Renderer.drawImage({
          Top: (Libs_Renderer.Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (Libs_Renderer.TopMargin),
          Left: (Libs_Renderer.X_CLIENT * 32) - ((Item.Size * 32) - 32) + (Libs_Renderer.LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: Item.IsAnimating ? (Libs_Board.AnimationFrame * 32) * Item.Size : 0,
          TopOffset: 0,
          Image: Item.Image,
        });
      }
    }
  },

  renderNicknames: function() {
    // players
    for(let playerId in Libs_Board.Players) if (Libs_Board.Players.hasOwnProperty(playerId)) {
      Libs_Renderer.renderCreatureHUD(Libs_Board.Players[playerId], 'Player');
    }
    // NPCs
    for(let npcId in Libs_Board.NPCs) if (Libs_Board.NPCs.hasOwnProperty(npcId)) {
      Libs_Renderer.renderCreatureHUD(Libs_Board.NPCs[npcId], 'NPC');
    }
    // hero
    Libs_Renderer.renderCreatureHUD(Libs_Hero, 'Hero');
  },

  renderCreatureHUD: function(Creature, CreatureType) {
    let Top, Left, Color, VirtualCoords;
    if(CreatureType === 'Player') {
      // If player is walking we have to pretend that he is still on previous SQM (for first 16 frames of animation) to keep good layer order
      VirtualCoords = Libs_Board.getCreatureVirtualCoordinates(Creature);
      Top = (VirtualCoords.Y * 32) - 14 + (Libs_Renderer.TopMargin) + Libs_Player.getTopMargin(Creature.Id);
      Left = (VirtualCoords.X * 32) + 4 + (Libs_Renderer.LeftMargin) + Libs_Player.getLeftMargin(Creature.Id);
      Color = '#00c000';
    }
    if(CreatureType === 'NPC') {
      Top = (Creature.Y - Libs_Board.AreaStart.Y) * 32 - 14 + Libs_Renderer.TopMargin;
      Left = (Creature.X - Libs_Board.AreaStart.X) * 32 + 4 + Libs_Renderer.LeftMargin;
//      Color = '#f86060';
//      Color = '#60f8f8';
      Color = '#20a0ff';
    }
    if(CreatureType === 'Hero') {
      Top = (Creature.Y - Libs_Board.AreaStart.Y) * 32 - 14;
      Left = (Creature.X - Libs_Board.AreaStart.X) * 32 + 4;
      Color = '#00c000';
    }

    // draw nicknames
    Libs_Renderer.drawText({
      Text: Creature.Name,
      Font: "bold 12px Tahoma",
      Top: Top*Libs_Board.Scale,
      Left: Left*Libs_Board.Scale,
      Color: Color,
      Stroke: true,
      StrokeColor: '#000000',
      StrokeWidth: 2
    });

    // draw hp bar
    Libs_Board.hudCTX.fillStyle = '#000000';
    Libs_Board.hudCTX.fillRect(Left*Libs_Board.Scale-13.5, Top*Libs_Board.Scale+3.5, 27.5, 4.5);
    Libs_Board.hudCTX.fillStyle = Color;
    Libs_Board.hudCTX.fillRect(Left*Libs_Board.Scale-12.5, Top*Libs_Board.Scale+4.5, 25.5, 2);
  },

  renderFog: function() {
    // draw lights on board
    Libs_Board.boardCTX.globalAlpha = Libs_Renderer.LightPower;
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
    Libs_Board.boardCTX.globalAlpha = Libs_Renderer.FogDensity;
    Libs_Board.boardCTX.globalCompositeOperation = 'multiply';
    Libs_Board.boardCTX.drawImage(Libs_Board.fog, 0, 0);

    // reset globals
    Libs_Board.boardCTX.globalAlpha = 1;
    Libs_Board.boardCTX.globalCompositeOperation = 'source-over';
  },

  addLightSource: function(params) {
    if(Libs_Renderer.LightImage) {
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
      Libs_Board.lightCTX.drawImage(Libs_Renderer.LightImage, leftOffset,topOffset,32,32, params.Left + params.Margins, params.Top + params.Margins, 32*params.LightSize, 32*params.LightSize);
    }
  },

  drawImage: function(params) {
    Libs_Board.boardCTX.drawImage(params.Image, params.LeftOffset, params.TopOffset, params.Width, params.Height, params.Left, params.Top, params.Width, params.Height);
  },

  drawText: function(params) {
    Libs_Board.hudCTX.font = params.Font;
    Libs_Board.hudCTX.textAlign = "center";
    if(params.Stroke) {
      Libs_Board.hudCTX.lineJoin="round";
      Libs_Board.hudCTX.miterLimit=2;
      Libs_Board.hudCTX.strokeStyle = params.StrokeColor;
      Libs_Board.hudCTX.lineWidth = params.StrokeWidth;
      Libs_Board.hudCTX.strokeText(params.Text, params.Left, params.Top);

      Libs_Board.hudCTX.fillStyle = params.StrokeColor;
      Libs_Board.hudCTX.fillText(params.Text, params.Left-1, params.Top-1);
      Libs_Board.hudCTX.fillText(params.Text, params.Left-1, params.Top+1);
      Libs_Board.hudCTX.fillText(params.Text, params.Left+1, params.Top-1);
      Libs_Board.hudCTX.fillText(params.Text, params.Left+1, params.Top+1);
    }
    Libs_Board.hudCTX.fillStyle = params.Color;
    Libs_Board.hudCTX.fillText(params.Text, params.Left, params.Top);
  },

};