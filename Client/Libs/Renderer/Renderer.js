var Libs_Renderer = {

  // customizable parameters
  FramerateLimit: 80,
  MaxAltitude: 24,
  CreaturesOffset: 38,
  LightImage: null,
  LightEffects: true,
  LightPower: 0.35, // 0.35 seems be ok
  FogDensitySurface: 0.25, // 0.25 seems be ok
  FogDensityUnderground: 0.75, // 0.75 seems be ok

  // renderer state fields
  RenderingInProgress: false,
  RenderingStopped: false,
  FramesDropped: 0,
  FramesRendered: 0,
  CurrentFramerate: 0,

  // rendering auxiliary fields
  TopMargin: 0,
  LeftMargin: 0,
  X_SERVER: 0,
  Y_SERVER: 0,
  X_CLIENT: 0,
  Y_CLIENT: 0,
  X_CLIENT_VIRTUAL: 0,
  Y_CLIENT_VIRTUAL: 0,
  Z: 0,

  init: function() {
    Libs_Renderer.run();
    setInterval(function() {
      Libs_Board.AnimationFrame = Libs_Board.AnimationFrame >= 4 ? 1 : ++Libs_Board.AnimationFrame;
      Libs_Renderer.CurrentFramerate = Libs_Renderer.FramesRendered;
      Libs_Renderer.FramesRendered = 0;
    }, 250);
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
    Libs_Renderer.Z = 0;
    for(Libs_Renderer.Z in Libs_Board.Area) if (Libs_Board.Area.hasOwnProperty(Libs_Renderer.Z)) {
      if(Libs_Renderer.stopFloorRendering()) {
        break;
      }

      for(let areaIteration=1;areaIteration<=areaIterations;areaIteration++) {
        Libs_Renderer.Y_CLIENT = 0;
        for(Libs_Renderer.Y_SERVER in Libs_Board.Area[Libs_Renderer.Z]) if (Libs_Board.Area[Libs_Renderer.Z].hasOwnProperty(Libs_Renderer.Y_SERVER)) {
          Libs_Renderer.X_CLIENT = 0;
          for (Libs_Renderer.X_SERVER in Libs_Board.Area[Libs_Renderer.Z][Libs_Renderer.Y_SERVER]) if (Libs_Board.Area[Libs_Renderer.Z][Libs_Renderer.Y_SERVER].hasOwnProperty(Libs_Renderer.X_SERVER)) {

            let SQM = Libs_Board.Area[Libs_Renderer.Z][Libs_Renderer.Y_SERVER][Libs_Renderer.X_SERVER];

            if(areaIteration === 1) {
              Libs_Renderer.renderFloor(SQM);
            }
            if(areaIteration === 2) {
              Libs_Renderer.renderItems(SQM);
              Libs_Renderer.renderHero(SQM);
              Libs_Renderer.renderPlayers(SQM);
              Libs_Renderer.renderNPCs(SQM);
              Libs_Renderer.renderEffects(SQM);
              Libs_Renderer.renderItemsAlwaysTop(SQM);
            }

            Libs_Renderer.X_CLIENT++;
          }
          Libs_Renderer.Y_CLIENT++;
        }

      }
    }

    // Libs_Renderer.renderCursor();
    Libs_Renderer.renderNicknames();
    if(Libs_Renderer.LightEffects) {
      Libs_Renderer.renderFog();
    }

    Libs_Renderer.renderChat();

    Libs_Renderer.RenderingInProgress = false;
    Libs_Renderer.FramesRendered++;
  },

  renderFloor: function(SQM) {
    for(let stack in SQM) if (SQM.hasOwnProperty(stack)) {
      let Item = Libs_Item.Items[SQM[stack]['Id']];
      if(Item.Id === '0') {
        continue;
      }
      if(['1','2'].includes(Item.ItemTypeId)) {
        if(Item.LightLevel > 0 && Item.LightRadius > 0 && Libs_Renderer.LightEffects) {
          Libs_Renderer.addLightSource({
            Top: (Libs_Renderer.Y_CLIENT * 32) + (Item.Size * 16) + (Libs_Renderer.TopMargin),
            Left: (Libs_Renderer.X_CLIENT * 32) + (Item.Size * 16) + (Libs_Renderer.LeftMargin),
            LightLevel: Item.LightLevel,
            LightColor: Item.LightColor,
            LightRadius: Item.LightRadius,
            Margins: 0
          });
        }
        Libs_Renderer.drawImage({
          Top: (Libs_Renderer.Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (Libs_Renderer.TopMargin),
          Left: (Libs_Renderer.X_CLIENT * 32) - ((Item.Size * 32) - 32) + (Libs_Renderer.LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Libs_Item.getItemImage(Item),
        });
      }
    }
  },

  renderHero: function(SQM) {
    Libs_Renderer.calcClientVirtual();
    if(parseInt(Libs_Hero.Z) === parseInt(Libs_Renderer.Z) && parseInt(Libs_Hero.Y_Virtual) === parseInt(Libs_Renderer.Y_SERVER) && parseInt(Libs_Hero.X_Virtual) === parseInt(Libs_Renderer.X_SERVER)) {
      Libs_Hero.Altitude = 0;
      for(let stack in SQM) if (SQM.hasOwnProperty(stack)) {
        Libs_Hero.Altitude += Libs_Item.Items[SQM[stack]['Id']].Altitude;
      }
      Libs_Hero.Altitude = Libs_Hero.Altitude > Libs_Renderer.MaxAltitude ? Libs_Renderer.MaxAltitude : Libs_Hero.Altitude;
      if(Libs_Renderer.LightEffects) {
        Libs_Renderer.addLightSource({
          Top: (Libs_Renderer.Y_CLIENT_VIRTUAL * 32) + 13,
          Left: (Libs_Renderer.X_CLIENT_VIRTUAL * 32) + 10,
          LightLevel: 5,
          LightColor: 'orange',
          LightRadius: 3,
          Margins: 0
        });
      }
      Libs_Renderer.drawImage({
        Top: ((Libs_Renderer.Y_CLIENT_VIRTUAL * 32) - Libs_Renderer.CreaturesOffset) - Libs_Hero.Altitude,
        Left: ((Libs_Renderer.X_CLIENT_VIRTUAL * 32) - Libs_Renderer.CreaturesOffset) - Libs_Hero.Altitude,
        Width: 64,
        Height: 64,
        LeftOffset: Libs_Hero.getLeftOffset(),
        TopOffset: Libs_Hero.getTopOffset(),
        Image: Libs_Hero.Image
      });
    }
  },

  renderPlayers: function(SQM) {
    for(let playerId in Libs_Board.Players) if (Libs_Board.Players.hasOwnProperty(playerId)) {
      let Player = Libs_Board.Players[playerId];
      if(parseInt(Player.Z) === parseInt(Libs_Renderer.Z) && parseInt(Player.Y_Virtual) === parseInt(Libs_Renderer.Y_SERVER) && parseInt(Player.X_Virtual) === parseInt(Libs_Renderer.X_SERVER)) {
        Player.Altitude = 0;
        for(let stack in SQM) if (SQM.hasOwnProperty(stack)) {
          Player.Altitude += Libs_Item.Items[SQM[stack]['Id']].Altitude;
        }
        Player.Altitude = Player.Altitude > Libs_Renderer.MaxAltitude ? Libs_Renderer.MaxAltitude : Player.Altitude;
        Libs_Renderer.drawImage({
          Top: ((Libs_Renderer.Y_CLIENT * 32) - Libs_Renderer.CreaturesOffset) + (Libs_Renderer.TopMargin) + Libs_Player.getTopMargin(playerId) - Player.Altitude,
          Left: ((Libs_Renderer.X_CLIENT* 32) - Libs_Renderer.CreaturesOffset) + (Libs_Renderer.LeftMargin) + Libs_Player.getLeftMargin(playerId) - Player.Altitude,
          Width: 64,
          Height: 64,
          LeftOffset: Libs_Player.getLeftOffset(playerId),
          TopOffset: Libs_Player.getTopOffset(playerId),
          Image: Player.Image
        });
      }
    }
  },

  renderNPCs: function(SQM) {
    for(let npcId in Libs_Board.NPCs) if (Libs_Board.NPCs.hasOwnProperty(npcId)) {
      let NPC = Libs_Board.NPCs[npcId];
      if(parseInt(NPC.Z) === parseInt(Libs_Renderer.Z) && parseInt(NPC.Y) === parseInt(Libs_Renderer.Y_SERVER) && parseInt(NPC.X) === parseInt(Libs_Renderer.X_SERVER)) {
        NPC.Altitude = 0;
        for(let stack in SQM) if (SQM.hasOwnProperty(stack)) {
          NPC.Altitude += Libs_Item.Items[SQM[stack]['Id']].Altitude;
        }
        NPC.Altitude = NPC.Altitude > Libs_Renderer.MaxAltitude ? Libs_Renderer.MaxAltitude : NPC.Altitude;
        Libs_Renderer.drawImage({
          Top: ((Libs_Renderer.Y_CLIENT * 32) - Libs_Renderer.CreaturesOffset) + (Libs_Renderer.TopMargin) - NPC.Altitude,
          Left: ((Libs_Renderer.X_CLIENT* 32) - Libs_Renderer.CreaturesOffset) + (Libs_Renderer.LeftMargin) - NPC.Altitude,
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
      let Item = Libs_Item.Items[SQM[stack]['Id']];
      if(!(['1','2'].includes(Item.ItemTypeId))) {
        Altitude = Altitude > Libs_Renderer.MaxAltitude ? Libs_Renderer.MaxAltitude : Altitude;

        let Quantity = SQM[stack]['Quantity'];
        if(Item.IsAlwaysTop) {
          continue;
        }

        if(Item.LightLevel > 0 && Item.LightRadius > 0 && Libs_Renderer.LightEffects) {
          Libs_Renderer.addLightSource({
            Top: (Libs_Renderer.Y_CLIENT * 32) + (Item.Size * 16) + (Item.PaddingY) + (Libs_Renderer.TopMargin),
            Left: (Libs_Renderer.X_CLIENT * 32) + (Item.Size * 16) + (Item.PaddingX) + (Libs_Renderer.LeftMargin),
            LightLevel: Item.LightLevel,
            LightColor: Item.LightColor,
            LightRadius: Item.LightRadius,
            Margins: Altitude*(-1)
          });
        }
        Libs_Renderer.drawImage({
          Top: (Libs_Renderer.Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (Item.PaddingY) + (Libs_Renderer.TopMargin) - Altitude,
          Left: (Libs_Renderer.X_CLIENT * 32) - ((Item.Size * 32) - 32) + (Item.PaddingX) + (Libs_Renderer.LeftMargin) - Altitude,
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Libs_Item.getItemImage(Item, Quantity),
        });
        Altitude += parseInt(Item.Altitude);
      }
    }
  },

  renderEffects: function(SQM) {
    for(let unique in Libs_Board.Effects) if (Libs_Board.Effects.hasOwnProperty(unique)) {
      if(Libs_Board.Effects[unique].Z === parseInt(Libs_Renderer.Z) && Libs_Board.Effects[unique].X === parseInt(Libs_Renderer.X_SERVER) && Libs_Board.Effects[unique].Y === parseInt(Libs_Renderer.Y_SERVER)) {
        let Altitude = Libs_Board.Effects[unique].Altitude;
        for(let stack in SQM) if (SQM.hasOwnProperty(stack)) {
          Altitude += Libs_Item.Items[SQM[stack]['Id']].Altitude;
        }
        Altitude = Altitude > Libs_Renderer.MaxAltitude ? Libs_Renderer.MaxAltitude : Altitude;

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
      let Item = Libs_Item.Items[SQM[stack]['Id']];
      if(!(Item.IsAlwaysTop)) {
        continue;
      }
      if(!([1,2].includes(Item.ItemTypeId))) {
        if(Item.LightLevel > 0 && Item.LightRadius > 0 && Libs_Renderer.LightEffects) {
          Libs_Renderer.addLightSource({
            Top: (Libs_Renderer.Y_CLIENT * 32) + (Item.Size * 16) + (Item.PaddingY) + (Libs_Renderer.TopMargin),
            Left: (Libs_Renderer.X_CLIENT * 32) + (Item.Size * 16) + (Item.PaddingX) + (Libs_Renderer.LeftMargin),
            LightLevel: Item.LightLevel,
            LightColor: Item.LightColor,
            LightRadius: Item.LightRadius,
            Margins: 0
          });
        }
        Libs_Renderer.drawImage({
          Top: (Libs_Renderer.Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (Item.PaddingY) + (Libs_Renderer.TopMargin),
          Left: (Libs_Renderer.X_CLIENT * 32) - ((Item.Size * 32) - 32) + (Item.PaddingX) + (Libs_Renderer.LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Libs_Item.getItemImage(Item),
        });
      }
    }
  },

  renderCursor: function() {
    /** BOARD: */
    Libs_Board.boardCTX.strokeStyle = '#0044ff';
    Libs_Board.boardCTX.globalCompositeOperation = 'difference';
    Libs_Board.boardCTX.strokeRect(
      Libs_Board.CursorPosition.X * (32) + (Libs_Renderer.LeftMargin),
      Libs_Board.CursorPosition.Y * (32) + (Libs_Renderer.TopMargin),
      32, 32
    );
    Libs_Board.boardCTX.globalCompositeOperation = 'source-over';

    /** HUD: */
    // Libs_Board.hudCTX.strokeStyle = '#0044ff';
    // Libs_Board.hudCTX.globalAlpha = 0.4;
    // Libs_Board.hudCTX.strokeRect(
    //   Libs_Board.CursorPosition.X * (32 * Libs_Board.Scale) + (Libs_Renderer.LeftMargin * Libs_Board.Scale),
    //   Libs_Board.CursorPosition.Y * (32 * Libs_Board.Scale) + (Libs_Renderer.TopMargin * Libs_Board.Scale),
    //   32*Libs_Board.Scale, 32*Libs_Board.Scale
    // );
    // Libs_Board.hudCTX.globalAlpha = 1;

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
    if(parseInt(Creature.Z) !== parseInt(Libs_Hero.Z)) {
      return;
    }
    let Top, Left, Color, VirtualCoords;
    if(CreatureType === 'Player') {
      // If player is walking we have to pretend that he is still on previous SQM (for first 16 frames of animation) to keep good layer order
      VirtualCoords = Libs_Board.getCreatureVirtualCoordinates(Creature);
      Top = (VirtualCoords.Y * 32) - 13 + (Libs_Renderer.TopMargin) + Libs_Player.getTopMargin(Creature.Id);
      Left = (VirtualCoords.X * 32) + 6 + (Libs_Renderer.LeftMargin) + Libs_Player.getLeftMargin(Creature.Id);
      Color = '#00c000';
    }
    if(CreatureType === 'NPC') {
      Top = (Creature.Y - Libs_Board.AreaStart.Y) * 32 - 13 + Libs_Renderer.TopMargin;
      Left = (Creature.X - Libs_Board.AreaStart.X) * 32 + 6 + Libs_Renderer.LeftMargin;
//      Color = '#f86060';
//      Color = '#60f8f8';
      Color = '#20a0ff';
    }
    if(CreatureType === 'Hero') {
      Top = (Creature.Y - Libs_Board.AreaStart.Y) * 32 - 13;
      Left = (Creature.X - Libs_Board.AreaStart.X) * 32 + 6;
      Color = '#00c000';
    }
    if(Libs_Hero.Z >= 0) {
      Top = Top - (32*Libs_Hero.Z);
      Left = Left - (32*Libs_Hero.Z);
    } else {
      Top = Top - (32*(Libs_Hero.Z+1));
      Left = Left - (32*(Libs_Hero.Z+1));
    }

    // draw nicknames
    Libs_Renderer.drawText({
      Text: Creature.Name,
      Font: "bold 12px Tahoma",
      Top: Top*Libs_Board.Scale - (Creature.Altitude*Libs_Board.Scale),
      Left: Left*Libs_Board.Scale - (Creature.Altitude*Libs_Board.Scale),
      Color: Color,
      Stroke: true,
      StrokeColor: '#000000',
      StrokeWidth: 2
    });

    // draw hp bar
    Libs_Board.hudCTX.fillStyle = '#000000';
    Libs_Board.hudCTX.fillRect((Left*Libs_Board.Scale-13.5)-(Creature.Altitude*Libs_Board.Scale), (Top*Libs_Board.Scale+3.5)-(Creature.Altitude*Libs_Board.Scale), 27.5, 4.5);
    Libs_Board.hudCTX.fillStyle = Color;
    Libs_Board.hudCTX.fillRect((Left*Libs_Board.Scale-12.5)-(Creature.Altitude*Libs_Board.Scale), (Top*Libs_Board.Scale+4.5)-(Creature.Altitude*Libs_Board.Scale), 25.5, 2);
  },

  renderChat: function() {
    // iterate over pair player-sqm
    for(let i in Libs_Chat.Messages) if (Libs_Chat.Messages.hasOwnProperty(i)) {
      // iterate over messages
      let count = 0;
      let Altitude = -8 - (Object.entries(Libs_Chat.Messages[i]).length * 8);

      for(let j in Libs_Chat.Messages[i]) if (Libs_Chat.Messages[i].hasOwnProperty(j)) {
        let Message = Libs_Chat.Messages[i][j];


        if(parseInt(Message.Z) !== parseInt(Libs_Hero.Z)) {
          continue;
        }

        let FloorMargin = 0;
        if(Libs_Hero.Z >= 0) {
          FloorMargin = (32*Libs_Hero.Z*Libs_Board.Scale);
        } else {
          FloorMargin = (32*(Libs_Hero.Z+1)*Libs_Board.Scale);
        }

        // if first message add: Author says:
        if(count === 0) {
          Libs_Renderer.drawText({
            Text: Message.Author + ' says:',
            Font: "bold 12px Tahoma",
            Top: ((Message.Y - Libs_Board.AreaStart.Y) * 32 + (Libs_Renderer.TopMargin) + Altitude) * Libs_Board.Scale - FloorMargin,
            Left: ((Message.X - Libs_Board.AreaStart.X) * 32 + (Libs_Renderer.LeftMargin) + 8) * Libs_Board.Scale - FloorMargin,
            Color: '#fcff00',
            Stroke: true,
            StrokeColor: '#000000',
            StrokeWidth: 2
          });
          Altitude = Altitude + 8;
        }
        count++;

        Libs_Renderer.drawText({
          Text: Message.Message,
          Font: "bold 12px Tahoma",
          Top: ((Message.Y - Libs_Board.AreaStart.Y) * 32 + (Libs_Renderer.TopMargin) + Altitude) * Libs_Board.Scale - FloorMargin,
          Left: ((Message.X - Libs_Board.AreaStart.X) * 32 + (Libs_Renderer.LeftMargin) + 8) * Libs_Board.Scale - FloorMargin,
          Color: '#fcff00',
          Stroke: true,
          StrokeColor: '#000000',
          StrokeWidth: 2
        });
        Altitude = Altitude + 8;

      }
    }
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
    if(Libs_Hero.Z >= 0) {
      Libs_Board.boardCTX.globalAlpha = Libs_Renderer.FogDensitySurface;
    } else {
      Libs_Board.boardCTX.globalAlpha = Libs_Renderer.FogDensityUnderground;
    }
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
      params.LightRadius = params.LightRadius*2;
      params.Left = params.Left - ((32*params.LightRadius)/2);
      params.Top = params.Top - ((32*params.LightRadius)/2);
      Libs_Board.lightCTX.drawImage(Libs_Renderer.LightImage, leftOffset,topOffset,32,32, params.Left + params.Margins, params.Top + params.Margins, 32*params.LightRadius, 32*params.LightRadius);
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

  stopFloorRendering: function() {
    if(Libs_Renderer.Z > Libs_Hero.Z) {

      if(!(Libs_Misc.isSQMEmpty(Libs_Hero.X_Virtual,Libs_Hero.Y_Virtual,Libs_Renderer.Z, true))) {
        return true;
      }
      if(!(Libs_Misc.isSQMEmpty(Libs_Hero.X_Virtual,Libs_Hero.Y_Virtual+1,Libs_Renderer.Z, true))) {
        return true;
      }
      if(!(Libs_Misc.isSQMEmpty(Libs_Hero.X_Virtual+1,Libs_Hero.Y_Virtual,Libs_Renderer.Z, true))) {
        return true;
      }
      if(!(Libs_Misc.isSQMEmpty(Libs_Hero.X_Virtual+1,Libs_Hero.Y_Virtual+1,Libs_Renderer.Z, true))) {
        return true;
      }

      if(!(Libs_Misc.isSQMBlockingUpperView(Libs_Hero.X_Virtual-1,Libs_Hero.Y_Virtual,Libs_Hero.Z))) {
        if(!(Libs_Misc.isSQMEmpty(Libs_Hero.X_Virtual-1,Libs_Hero.Y_Virtual,Libs_Renderer.Z, true))) {
          return true;
        }
      }
      if(!(Libs_Misc.isSQMBlockingUpperView(Libs_Hero.X_Virtual,Libs_Hero.Y_Virtual-1,Libs_Hero.Z))) {
        if(!(Libs_Misc.isSQMEmpty(Libs_Hero.X_Virtual,Libs_Hero.Y_Virtual-1,Libs_Renderer.Z, true))) {
          return true;
        }
      }
      if(!(Libs_Misc.isSQMBlockingUpperView(Libs_Hero.X_Virtual+1,Libs_Hero.Y_Virtual,Libs_Hero.Z))) {
        if(!(Libs_Misc.isSQMEmpty(Libs_Hero.X_Virtual+2,Libs_Hero.Y_Virtual,Libs_Renderer.Z, true))) {
          return true;
        }
      }
      if(!(Libs_Misc.isSQMBlockingUpperView(Libs_Hero.X_Virtual,Libs_Hero.Y_Virtual+1,Libs_Hero.Z))) {
        if(!(Libs_Misc.isSQMEmpty(Libs_Hero.X_Virtual,Libs_Hero.Y_Virtual+2,Libs_Renderer.Z, true))) {
          return true;
        }
      }
    }
    return false;
  },

  calcClientVirtual: function() {
    Libs_Renderer.X_CLIENT_VIRTUAL = Libs_Renderer.X_CLIENT;
    Libs_Renderer.Y_CLIENT_VIRTUAL = Libs_Renderer.Y_CLIENT;
    if(Libs_Hero.Animation.CurrentFrame > 16) {
      switch(Libs_Hero.Direction) {
        case 'North':
          Libs_Renderer.Y_CLIENT_VIRTUAL++;
          break;
        case 'NorthEast':
          Libs_Renderer.Y_CLIENT_VIRTUAL++;
          Libs_Renderer.X_CLIENT_VIRTUAL--;
          break;
        case 'NorthWest':
          Libs_Renderer.Y_CLIENT_VIRTUAL++;
          Libs_Renderer.X_CLIENT_VIRTUAL++;
          break;
        case 'West':
          Libs_Renderer.X_CLIENT_VIRTUAL++;
          break;
        case 'East':
          Libs_Renderer.X_CLIENT_VIRTUAL--;
          break;
        case 'South':
          Libs_Renderer.Y_CLIENT_VIRTUAL--;
          break;
        case 'SouthEast':
          Libs_Renderer.X_CLIENT_VIRTUAL--;
          Libs_Renderer.Y_CLIENT_VIRTUAL--;
          break;
        case 'SouthWest':
          Libs_Renderer.X_CLIENT_VIRTUAL++;
          Libs_Renderer.Y_CLIENT_VIRTUAL--;
          break;
      }
    }
  }

};